import { db } from "@/lib/db"
import { channels, friendRequests, userFriends, users } from "@/lib/db/schema"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc"
import { logger } from "@/utils/logger"
import { TRPCError } from "@trpc/server"
import { and, eq, inArray, sql } from "drizzle-orm"
import { z } from "zod"
import { getUserIdFromEmail } from "./pusher"

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
  sendFriendRequestV2: publicProcedure
    .input(
      z.object({
        receiverEmail: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userEmail = ctx.session?.user?.email

      if (!userEmail) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        })
      }

      const friendRequestExists = await db
        .select()
        .from(friendRequests)
        .where(
          and(
            eq(friendRequests.senderEmail, userEmail),
            eq(friendRequests.receiverEmail, input.receiverEmail)
          )
        )
        .get()

      if (friendRequestExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Friend request already exists.",
        })
      }

      const record = await db
        .insert(friendRequests)
        .values({
          senderEmail: userEmail,
          receiverEmail: input.receiverEmail,
          status: "pending",
        })
        .returning()
        .get()

      logger({
        message: "user.sendFriendRequestV2",
        data: record,
        email: userEmail,
        level: "info",
      })

      return record
    }),
  acceptFriendRequestV2: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userEmail = ctx.session?.user?.email

      if (!userEmail) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        })
      }

      const matchingFriendRequest = await db
        .select()
        .from(friendRequests)
        .where(
          and(
            eq(friendRequests.senderEmail, input.email),
            eq(friendRequests.receiverEmail, userEmail),
            eq(friendRequests.status, "pending")
          )
        )
        .get()

      if (!matchingFriendRequest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No matching friend request found.",
        })
      }
      const updatedFriendRequest = await db
        .update(friendRequests)
        .set({
          status: "accepted",
        })
        .where(
          and(
            eq(friendRequests.senderEmail, input.email),
            eq(friendRequests.receiverEmail, userEmail)
          )
        )
        .returning()
        .get()

      const newChannel = await db
        .insert(channels)
        .values({
          id: crypto.randomUUID(),
        })
        .returning()
        .get()

      const userId = await getUserIdFromEmail(userEmail)
      const friendId = await getUserIdFromEmail(input.email)

      if (!userId || !friendId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User or friend not found",
        })
      }

      await db
        .insert(userFriends)
        .values([
          {
            userId: userId,
            friendId: friendId,
            channelId: newChannel.id,
            acceptedFriendRequest: "1",
          },
          {
            userId: friendId,
            friendId: userId,
            channelId: newChannel.id,
            acceptedFriendRequest: "1",
          },
        ])
        .returning()
        .get()

      return updatedFriendRequest
    }),
  getPendingFriendRequests: publicProcedure.query(async ({ ctx }) => {
    const email = ctx.session?.user.email

    if (!email) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      })
    }

    const pendingFriendRequests = await db
      .select({
        pendingFriendEmail: friendRequests.receiverEmail,
        pendingFriendImage: users.image,
      })
      .from(friendRequests)
      .innerJoin(users, eq(users.email, friendRequests.receiverEmail))
      .all()

    return pendingFriendRequests
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
        .values({
          userId: userId,
          friendId: friendId,
          channelId: channel.id,
          acceptedFriendRequest: "0",
        })
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
