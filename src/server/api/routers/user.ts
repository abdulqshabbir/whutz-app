import { db } from "@/lib/db/dbClient"
import { channels, userFriends, users } from "@/lib/db/schema"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { eq, inArray, sql } from "drizzle-orm"
import { z } from "zod"
import { getUserIdFromEmail } from "./pusher"
import { TRPCError } from "@trpc/server"

export const userRouter = createTRPCRouter({
  getUserIdFromEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .get()
      return {
        userId: result?.id ?? null,
      }
    }),
  getFriendsByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .query(async ({ input }) => {
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

      return friends
    }),
  sendFriendRequest: publicProcedure
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

      // create a new user-friend-chanel link
      await db
        .insert(userFriends)
        .values({
          userId: userId,
          friendId: friendId,
          channelId: channel.id,
        })
        .returning()
        .get()

      // return ok
      return {
        ok: 1,
      }
    }),
})
