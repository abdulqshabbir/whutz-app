import { db } from "@/lib/db/dbClient"
import { userFriends, users } from "@/lib/db/schema"
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
})
