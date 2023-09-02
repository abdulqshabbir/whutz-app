import { db } from "@/lib/db"
import { channels, userFriends, users } from "@/lib/db/schema"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc"
import { eq, inArray, sql } from "drizzle-orm"
import { z } from "zod"
import { getUserIdFromEmail } from "./pusher"
import { TRPCError } from "@trpc/server"
import { logger } from "@/utils/logger"

export const userRouter = createTRPCRouter({
  getUserIdFromEmail: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .get()

      if (!result) {
        logger({
          message: "uuserRotuer.getUserIdFromEmail",
          data: result,
          level: "error",
          email: ctx.session.user.email,
        })
      }

      logger({
        message: "userRotuer.getUserIdFromEmail",
        data: result,
        email: ctx.session.user.email,
        level: "info",
      })
      return result?.id ?? null
    }),
  getFriendsByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = await getUserIdFromEmail(input.email)
      if (!userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      const friends = await db
        .select({
          image: users.image,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(
          inArray(
            users.id,
            sql`(SELECT ${userFriends.friendId} FROM ${userFriends} WHERE ${userFriends.userId}=${userId}) `
          )
        )
        .all()

      logger({
        message: "userRouter.getFriendsByEmail",
        data: friends,
        email: ctx.session?.user.email,
        level: "info",
      })

      return friends
    }),
  sendFriendRequest: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        })
      }
      const userId = await getUserIdFromEmail(ctx.session.user.email)
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        })
      }

      const friendId = await getUserIdFromEmail(input.email)
      if (!friendId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This user isn't using our app yet! Please ask them to join before sending a friend request.",
        })
      }

      // create a new channel
      const channel = await db
        .insert(channels)
        .values({
          id: crypto.randomUUID(),
        })
        .returning()
        .get()

      if (channel) {
        logger({
          message: "userRouter.sendFriendRequest channel created!",
          data: channel,
          email: ctx.session.user.email,
          level: "info",
        })
      } else {
        logger({
          message: "userRouter.sendFriendRequest channel creation failed",
          data: channel,
          email: ctx.session.user.email,
          level: "error",
        })
      }
      // create a new user-friend-chanel link
      const userFriendLink = await db
        .insert(userFriends)
        .values([
          {
            userId: userId,
            friendId: friendId,
            channelId: channel.id,
          },
          {
            userId: friendId,
            friendId: userId,
            channelId: channel.id,
          },
        ])
        .returning()
        .get()

      if (userFriendLink) {
        logger({
          message: "userRouter.sendFriendRequest userFriendLink created!",
          data: userFriendLink,
          email: ctx.session.user.email,
          level: "info",
        })
      } else {
        logger({
          message:
            "userRouter.sendFriendRequest userFriendLink creation failed",
          data: userFriendLink,
          email: ctx.session.user.email,
          level: "error",
        })
      }

      // return ok
      return {
        ok: 1,
      }
    }),
})
