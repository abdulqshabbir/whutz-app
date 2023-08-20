import { env } from "@/env.mjs"
import { db } from "@/lib/db/dbClient"
import { messages, users } from "@/lib/db/schema"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { asc, eq } from "drizzle-orm"
import Pusher from "pusher"
import { z } from "zod"

export const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.PUSHER_CLUSTER,
  useTLS: true,
})

function now() {
  return Math.floor(new Date().getTime() / 1000)
}

type Who = "ME" | "FRIEND"
async function getUserIdFromEmail(email: string) {
  const user = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, email ?? ""))
    .get()

  return user?.id ?? null
}

export const pusherRouter = createTRPCRouter({
  getByChannel: publicProcedure
    .input(
      z.object({
        channel: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.session?.user?.email) {
        return []
      }
      const channelId = input.channel
      const result = await db
        .select({
          sender: messages.sender,
          reciever: messages.reciever,
          type: messages.type,
          content: messages.content,
          timestamp: messages.timestamp,
        })
        .from(messages)
        .where(eq(messages.channel, channelId))
        .orderBy(asc(messages.timestamp))
        .all()

      const userId = await getUserIdFromEmail(ctx.session.user.email)

      return result.map((m) => {
        return {
          ...m,
          from: (m.sender === userId ? "ME" : "FRIEND") as Who,
        }
      })
    }),
  send: publicProcedure
    .input(
      z.object({
        fromEmail: z.string().email(),
        toEmail: z.string().email(),
        channel: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user.email) {
        return
      }

      const fromId = await getUserIdFromEmail(input.fromEmail)
      const toId = await getUserIdFromEmail(input.toEmail)

      if (!fromId) {
        throw new TRPCError({
          message: "Sender email could not be found",
          code: "BAD_REQUEST",
        })
      }

      if (!toId) {
        throw new TRPCError({
          message: "Reciever email could not be found",
          code: "BAD_REQUEST",
        })
      }

      const newMessage = await db
        .insert(messages)
        .values({
          sender: fromId,
          reciever: toId,
          channel: input.channel,
          type: "text",
          content: input.content,
          timestamp: now(),
        })
        .returning()
        .get()

      const userId = await getUserIdFromEmail(ctx.session.user.email)

      const allMessagesForChannel = await db
        .select({
          sender: messages.sender,
          timestamp: messages.timestamp,
          type: messages.type,
          content: messages.content,
        })
        .from(messages)
        .where(eq(messages.channel, input.channel))
        .all()

      await pusher.trigger(input.channel, "message", {
        data: allMessagesForChannel.map((m) => ({
          timestamp: m.timestamp,
          type: m.type,
          content: m.content,
          from: (userId === fromId ? "ME" : "FRIEND") as Who,
        })),
      })

      return {
        data: {
          from: newMessage.sender,
          to: newMessage.reciever,
          channel: newMessage.channel,
          type: newMessage.type,
          content: newMessage.content,
          timestamp: newMessage.timestamp,
        },
      }
    }),
})
