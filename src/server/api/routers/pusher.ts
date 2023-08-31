import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import { messages, users } from "@/lib/db/schema"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { asc, eq } from "drizzle-orm"
import Pusher from "pusher"
import { z } from "zod"
import { type Message } from "@/components/ChatHistory"

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

export async function getUserIdFromEmail(email: string) {
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
          id: messages.id,
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

      const senderEmailAndIds = await db
        .selectDistinct({
          senderId: messages.sender,
          senderEmail: users.email,
        })
        .from(messages)
        .innerJoin(users, eq(messages.sender, users.id))
        .all()

      const recieverEmailAndIds = await db
        .selectDistinct({
          recieverId: messages.reciever,
          recieverEmail: users.email,
        })
        .from(messages)
        .innerJoin(users, eq(messages.reciever, users.id))
        .all()

      const returned = result.map((m) => {
        return {
          ...m,
          fromEmail: senderEmailAndIds.find((x) => x.senderId === m.sender)
            ?.senderEmail as unknown as string,
          toEmail: recieverEmailAndIds.find((x) => x.recieverId === m.reciever)
            ?.recieverEmail as unknown as string,
          id: m.id,
        }
      })

      return returned
    }),
  send: publicProcedure
    .input(
      z.object({
        fromEmail: z.string().email(),
        toEmail: z.string().email(),
        channel: z.string().min(1),
        content: z.string().min(1),
        type: z.enum(["text", "image"]),
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
          type: input.type,
          content: input.content,
          timestamp: now(),
        })
        .returning()
        .get()

      const allMessagesForChannel = await db
        .select({
          sender: messages.sender,
          reciever: messages.reciever,
          timestamp: messages.timestamp,
          type: messages.type,
          content: messages.content,
          id: messages.id,
        })
        .from(messages)
        .where(eq(messages.channel, input.channel))
        .all()

      const senderEmailAndIds = await db
        .selectDistinct({
          senderId: messages.sender,
          senderEmail: users.email,
        })
        .from(messages)
        .innerJoin(users, eq(messages.sender, users.id))
        .all()

      const recieverEmailAndIds = await db
        .selectDistinct({
          recieverId: messages.reciever,
          recieverEmail: users.email,
        })
        .from(messages)
        .innerJoin(users, eq(messages.reciever, users.id))
        .all()

      async function triggerChunked(
        pusher: Pusher,
        channel: string | string[],
        event: string,
        data: Omit<Message, "shouldAnimage">
      ) {
        const chunkSize = 4000
        const str = JSON.stringify(data)
        const msgId = Math.random() + ""
        for (let i = 0; i * chunkSize < str.length; i++) {
          await pusher.trigger(channel, "chunked-" + event, {
            id: msgId,
            index: i,
            chunk: str.substr(i * chunkSize, chunkSize),
            final: chunkSize * (i + 1) >= str.length,
          })
        }
      }

      const data = allMessagesForChannel.map((m) => ({
        timestamp: m.timestamp,
        type: m.type,
        content: m.content,
        fromEmail: senderEmailAndIds.find((x) => x.senderId === m.sender)
          ?.senderEmail as unknown as string,
        toEmail: recieverEmailAndIds.find((x) => x.recieverId === m.reciever)
          ?.recieverEmail as unknown as string,
        id: m.id,
      }))
      await triggerChunked(pusher, input.channel, "message", data)

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
