import { createTRPCRouter } from "@/server/api/trpc"
import { userRouter } from "./routers/user"
import { friendRouter } from "./routers/friend"
import { messagesRouter } from "./routers/pusher"
import { channelRouter } from "./routers/channel"
import { s3Router } from "./routers/s3"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  friend: friendRouter,
  messages: messagesRouter,
  channel: channelRouter,
  s3: s3Router,
})

// export type definition of API
export type AppRouter = typeof appRouter
