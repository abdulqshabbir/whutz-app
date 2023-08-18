import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import Pusher from "pusher"
import { env } from "@/env.mjs"
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
  sendMessage: publicProcedure
    .input(
      z.object({
        from: z.string(),
        to: z.string(),
        channel: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await pusher.trigger(input.channel, "message", {
        data: {
          from: input.from,
          to: input.to,
          channel: input.channel,
          type: "text" as const,
          content: input.message,
          timestamp: now(),
        },
      })
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
