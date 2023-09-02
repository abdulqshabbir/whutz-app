import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { logger } from "@/utils/logger"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const friendRouter = createTRPCRouter({
  getProfileInfo: publicProcedure
    .input(
      z.object({
        friendEmail: z.string().min(1).email(),
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
      if (!result) {
        logger({
          message: "friendRouter.getProfileInfo friend info not found",
          data: result,
          level: "error",
        })
      } else {
        logger({
          message: "friendRouter.getProfileInfo",
          data: result,
          level: "info",
        })
      }
      return result
    }),
})
