import { env } from "@/env.mjs"
import { db } from "@/lib/db/dbClient"
import { messages } from "@/lib/db/schema"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
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

export const pusherRouter = createTRPCRouter({
  getByChannel: publicProcedure
    .input(
      z.object({
        channel: z.string(),
      })
    )
    .query(async ({ input }) => {
      const channelId = input.channel
      const channel = await db
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

      return channel ?? null
    }),
  send: publicProcedure
    .input(
      z.object({
        from: z.string().min(1),
        to: z.string().min(1),
        channel: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const newMessage = await db
        .insert(messages)
        .values({
          sender: input.from,
          reciever: input.to,
          channel: input.channel,
          type: "text",
          content: input.content,
          timestamp: now(),
        })
        .returning()
        .get()

      await pusher.trigger(input.channel, "message", {
        data: {
          from: newMessage.sender,
          to: newMessage.reciever,
          channel: newMessage.channel,
          type: newMessage.type,
          content: newMessage.content,
          timestamp: newMessage.timestamp,
        },
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
