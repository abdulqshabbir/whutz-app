import { db } from "@/lib/db/dbClient"
import { users } from "@/lib/db/schema"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { eq } from "drizzle-orm"
import { z } from "zod"

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
})
