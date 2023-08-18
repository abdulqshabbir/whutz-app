import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import Pusher from "pusher"
import { env } from "@/env.mjs"

export const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.PUSHER_CLUSTER,
  useTLS: true,
})

export const pusherRouter = createTRPCRouter({
  push: publicProcedure.mutation(async () => {
    const response = await pusher.trigger("hello-channel", "hello-event", {
      message: "hello world",
    })
    return {
      message: response.text(),
    }
  }),
})
