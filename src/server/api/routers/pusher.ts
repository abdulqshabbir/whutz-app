import { type Message } from "@/components/ChatHistory"
import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import { messageEmojies, messages, users } from "@/lib/db/schema"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc"
import { logger } from "@/utils/logger"
import { TRPCError } from "@trpc/server"
import { asc, eq, sql } from "drizzle-orm"
import { alias } from "drizzle-orm/sqlite-core"
import Pusher from "pusher"
import { z } from "zod"

export const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.PUSHER_CLUSTER,
  useTLS: true,
})

function now() {
  return Math.floor(new Date().getTime() / 1000)
}

export async function getUserIdFromEmail(email: string) {
  const user = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, email ?? ""))
    .get()

  return user?.id ?? null
}

export const messagesRouter = createTRPCRouter({
  getByChannel: protectedProcedure
    .input(
      z.object({
        channel: z.string().min(1),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.session?.user?.email) {
        throw new TRPCError({
          message: "User not logged in",
          code: "UNAUTHORIZED",
        })
      }
      const channelId = input.channel
      const replyMessages = alias(messages, "replyMessage")
      const result = await db
        .select({
          id: messages.id,
          sender: messages.sender,
          reciever: messages.reciever,
          type: messages.type,
          content: messages.content,
          timestamp: messages.timestamp,
          emojies: sql<string | null>`
          (
            select group_concat(${messageEmojies.emoji})
            from ${messageEmojies}
            where ${messageEmojies.messageId}=${messages.id}
          )`,
          replyToId: messages.replyToId,
          replyToContent: replyMessages.content,
          replyToType: replyMessages.type,
        })
        .from(messages)
        .leftJoin(replyMessages, eq(messages.replyToId, replyMessages.id))
        .where(eq(messages.channel, channelId))
        .orderBy(asc(messages.timestamp))
        .all()

      logger({
        message: "messagesRouter.getByChannel: get messages",
        data: result,
        email: ctx.session.user.email,
        level: "info",
      })

      const senderEmailAndIds = await db
        .selectDistinct({
          senderId: messages.sender,
          senderEmail: users.email,
        })
        .from(messages)
        .innerJoin(users, eq(messages.sender, users.id))
        .all()

      logger({
        message: "messagesRouter.getByChannel: get senderEmailAndIds",
        data: senderEmailAndIds,
        email: ctx.session.user.email,
        level: "info",
      })

      const recieverEmailAndIds = await db
        .selectDistinct({
          recieverId: messages.reciever,
          recieverEmail: users.email,
        })
        .from(messages)
        .innerJoin(users, eq(messages.reciever, users.id))
        .all()

      logger({
        message: "messagesRouter.getByChannel: get recieverEmailAndIds",
        data: recieverEmailAndIds,
        email: ctx.session.user.email,
        level: "info",
      })

      const returned = result.map((m) => {
        return {
          ...m,
          fromEmail: senderEmailAndIds.find((x) => x.senderId === m.sender)
            ?.senderEmail as unknown as string,
          toEmail: recieverEmailAndIds.find((x) => x.recieverId === m.reciever)
            ?.recieverEmail as unknown as string,
          id: m.id,
        }
      })

      logger({
        message: "messagesRouter.getByChannel: returned",
        data: {
          messages: returned,
        },
        email: ctx.session.user.email,
        level: "info",
      })

      return returned
    }),
  send: publicProcedure
    .input(
      z.object({
        fromEmail: z.string().email(),
        toEmail: z.string().email(),
        channel: z.string().min(1),
        content: z.string().min(1),
        type: z.enum(["text", "image"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user.email) {
        return
      }

      const fromId = await getUserIdFromEmail(input.fromEmail)
      const toId = await getUserIdFromEmail(input.toEmail)

      if (!fromId) {
        throw new TRPCError({
          message: "Sender email could not be found",
          code: "BAD_REQUEST",
        })
      }

      if (!toId) {
        throw new TRPCError({
          message: "Reciever email could not be found",
          code: "BAD_REQUEST",
        })
      }

      const newMessage = await db
        .insert(messages)
        .values({
          sender: fromId,
          reciever: toId,
          channel: input.channel,
          type: input.type,
          content: input.content,
          timestamp: now(),
        })
        .returning()
        .get()

      logger({
        message: "messagesRouter.send: newMessage",
        data: newMessage,
        email: ctx.session.user.email,
        level: "info",
      })

      const allMessagesForChannel = await db
        .select({
          sender: messages.sender,
          reciever: messages.reciever,
          timestamp: messages.timestamp,
          type: messages.type,
          content: messages.content,
          id: messages.id,
          emojies: sql<
            string | null
          >`(select group_concat(${messageEmojies.emoji}) from ${messageEmojies} where ${messageEmojies.messageId}=${messages.id})`,
        })
        .from(messages)
        .where(eq(messages.channel, input.channel))
        .all()

      logger({
        message: "messagesRouter.send: allMessagesForChannel",
        data: allMessagesForChannel,
        email: ctx.session.user.email,
        level: "info",
      })

      const senderEmailAndIds = await db
        .selectDistinct({
          senderId: messages.sender,
          senderEmail: users.email,
        })
        .from(messages)
        .innerJoin(users, eq(messages.sender, users.id))
        .all()

      logger({
        message: "messagesRouter.send: senderEmailAndIds",
        data: senderEmailAndIds,
        email: ctx.session.user.email,
        level: "info",
      })

      const recieverEmailAndIds = await db
        .selectDistinct({
          recieverId: messages.reciever,
          recieverEmail: users.email,
        })
        .from(messages)
        .innerJoin(users, eq(messages.reciever, users.id))
        .all()

      logger({
        message: "messagesRouter.send: recieverEmailAndIds",
        data: recieverEmailAndIds,
        email: ctx.session.user.email,
        level: "info",
      })

      async function triggerChunked(
        pusher: Pusher,
        channel: string | string[],
        event: string,
        data: Array<Omit<Message, "shouldAnimate">>
      ) {
        logger({
          message: "messagesRouter.send: triggerChunked called",
          data: {
            channel,
            event,
            data,
          },
          email: ctx.session?.user?.email,
          level: "info",
        })
        const chunkSize = 4000
        const str = JSON.stringify(data)
        const msgId = Math.random() + ""
        for (let i = 0; i * chunkSize < str.length; i++) {
          try {
            await pusher.trigger(channel, "chunked-" + event, {
              id: msgId,
              index: i,
              chunk: str.substr(i * chunkSize, chunkSize),
              final: chunkSize * (i + 1) >= str.length,
            })

            logger({
              message: "messagesRouter.send: triggerChunked",
              data: {
                id: msgId,
                index: i,
                chunk: str.substr(i * chunkSize, chunkSize),
                final: chunkSize * (i + 1) >= str.length,
              },
              email: ctx.session?.user?.email,
              level: "info",
            })
          } catch (e) {
            logger({
              message: "messagesRouter.send: triggerChunked error",
              data: e as object,
              email: ctx.session?.user?.email,
              level: "error",
            })
          }
        }
      }

      const data = allMessagesForChannel.map((m) => ({
        timestamp: m.timestamp,
        type: m.type,
        content: m.content,
        fromEmail: senderEmailAndIds.find((x) => x.senderId === m.sender)
          ?.senderEmail as unknown as string,
        toEmail: recieverEmailAndIds.find((x) => x.recieverId === m.reciever)
          ?.recieverEmail as unknown as string,
        id: m.id,
        emojies: m.emojies,
      }))
      await triggerChunked(pusher, input.channel, "message", data)

      return {
        data: {
          from: newMessage.sender,
          to: newMessage.reciever,
          channel: newMessage.channel,
          type: newMessage.type,
          content: newMessage.content,
          timestamp: newMessage.timestamp,
        },
      }
    }),
  reactWithEmoji: publicProcedure
    .input(
      z.object({
        messageId: z.number(),
        emoji: z.enum([
          "thumbs_up",
          "tears_of_joy",
          "cool",
          "fear",
          "eyes_heart",
        ]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newEmojiAdded = await db
        .insert(messageEmojies)
        .values({
          messageId: input.messageId,
          emoji: input.emoji,
        })
        .returning()
        .get()

      logger({
        message: "messagesRouter.reactWithEmoji: newEmojiAdded",
        data: newEmojiAdded,
        level: "info",
        email: ctx.session?.user.email,
      })

      return {
        messageId: newEmojiAdded.messageId,
        emoji: newEmojiAdded.emoji,
      }
    }),
})
