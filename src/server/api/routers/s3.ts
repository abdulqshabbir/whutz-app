import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { S3Client } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { type PresignedPostOptions } from "@aws-sdk/s3-presigned-post"
import { getUserIdFromEmail } from "./pusher"
import { TRPCError } from "@trpc/server"
import { env } from "@/env.mjs"

const client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

export const s3Router = createTRPCRouter({
  createPreSignedPostUrl: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.email) {
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
    const fileId = crypto.randomUUID()
    const preSignedPostOptions: PresignedPostOptions = {
      Bucket: "whutzapp",
      Key: `${userId}/${fileId}`,
      Fields: {
        acl: "public-read",
      },
      Conditions: [["starts-with", "Content-Type", ""]],
    }

    try {
      const { url, fields } = await createPresignedPost(client, {
        ...preSignedPostOptions,
        Expires: 3600,
      })
      return {
        ok: 1,
        presignedFields: fields,
        presignedUrl: url,
        fileId,
      }
    } catch (e) {
      console.error("pre-signed error: ", e)
      return {
        ok: 0,
        error: e,
      }
    }
  }),
})
