import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import Pusher from "pusher"
import { env } from "@/env.mjs"
import { z } from "zod"
import { db } from "@/lib/db/dbClient"
import { messages } from "@/lib/db/schema"

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
  sendMessage: publicProcedure
    .input(
      z.object({
        from: z.string(),
        to: z.string(),
        channel: z.number(),
        message: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await pusher.trigger(input.channel.toString(), "message", {
        data: {
          from: input.from,
          to: input.to,
          channel: input.channel,
          type: "text" as const,
          content: input.message,
          timestamp: now(),
        },
      })
      await db
        .insert(messages)
        .values({
          sender: input.from,
          reciever: input.to,
          channel: input.channel,
          type: "text",
          content: input.content,
        })
        .all()

      return {
        data: {
          from: input.from,
          to: input.to,
          channel: input.channel,
          type: "text" as const,
          content: input.message,
          timestamp: now(),
        },
      }
    }),
})
