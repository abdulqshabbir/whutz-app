import { db } from "@/lib/db"
import { userFriends } from "@/lib/db/schema"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { and, eq, or } from "drizzle-orm"
import { z } from "zod"
import { getUserIdFromEmail } from "./pusher"
import { logger } from "@/utils/logger"

export const channelRouter = createTRPCRouter({
  getChannelByUserAndFriendEmail: publicProcedure
    .input(
      z.object({
        userEmail: z.string(),
        friendEmail: z.string(),
      })
    )
    .query(async ({ input }) => {
      const firstId = await getUserIdFromEmail(input.userEmail)
      const secondId = await getUserIdFromEmail(input.friendEmail)
      if (!firstId || !secondId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not find user.",
        })
      }
      const result = await db
        .select({ channelId: userFriends.channelId })
        .from(userFriends)
        .where(
          or(
            and(
              eq(userFriends.userId, firstId),
              eq(userFriends.friendId, secondId)
            ),
            and(
              eq(userFriends.userId, secondId),
              eq(userFriends.friendId, firstId)
            )
          )
        )
        .get()

      if (!result) {
        logger({
          level: "error",
          message:
            "channelRouter.getChannelByUserAndFriendEmail: cannot not find channel.",
          data: {
            userEmail: input.userEmail,
            friendEmail: input.friendEmail,
          },
        })
      }

      if (!result) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not find channel.",
        })
      }

      logger({
        level: "info",
        message: "channelRouter.getChannelByUserAndFriendEmail: found channel.",
        data: {
          userEmail: input.userEmail,
          friendEmail: input.friendEmail,
          channelId: result.channelId,
        },
      })

      return result.channelId
    }),
})
