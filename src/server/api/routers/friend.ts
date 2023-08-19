import { db } from "@/lib/db/dbClient"
import { users } from "@/lib/db/schema"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const friendRouter = createTRPCRouter({
  add: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(({ input }) => {
      return {
        greeting: `Hello ${input.email}`,
      }
    }),
  getProfileInfo: publicProcedure
    .input(
      z.object({
        friendEmail: z.string().min(1),
        channel: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const result = await db
        .select({
          image: users.image,
          name: users.name,
        })
        .from(users)
        .where(eq(users.email, input.friendEmail))
        .get()
      return result
    }),
})
