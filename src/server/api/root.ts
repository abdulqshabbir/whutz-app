import { exampleRouter } from "@/server/api/routers/example"
import { createTRPCRouter } from "@/server/api/trpc"
import { friendRouter } from "./routers/friend"
import { pusherRouter } from "./routers/pusher"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  friend: friendRouter,
  pusher: pusherRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
