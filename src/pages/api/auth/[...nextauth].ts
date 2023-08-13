/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/*
  There seems to be a bug in the types for the drizzle-adapter and next-auth
  which is why we have to use `any` in some places.
*/

import { type DrizzleDB } from "@/lib/db/dbClient"
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema"
import { authOptions } from "@/server/auth"
import { and, eq } from "drizzle-orm"
import NextAuth, { type NextAuthOptions } from "next-auth"

export function DrizzleAdapter(db: DrizzleDB): NextAuthOptions["adapter"] {
  return {
    createUser: (data) => {
      return db
        .insert(users)
        .values({ ...data, id: crypto.randomUUID() })
        .returning()
        .get()
    },
    getUser: async (data) => {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, data))
        .get()
      return result ?? null
    },
    getUserByEmail: async (data) => {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, data))
        .get()
      return result ?? null
    },
    createSession: (data) => {
      return db.insert(sessions).values(data).returning().get()
    },
    getSessionAndUser: async (data) => {
      const result = await db
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(users, eq(users.id, sessions.userId))
        .get()
      return result ?? null
    },
    updateUser: (data) => {
      if (!data.id) {
        throw new Error("No user id.")
      }

      return db
        .update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning()
        .get()
    },
    updateSession: (data) => {
      return db
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .get()
    },
    linkAccount: async (rawAccount) => {
      const updatedAccount = (await db
        .insert(accounts)
        .values(rawAccount)
        .returning()
        .get()) as unknown as any

      const account = {
        ...updatedAccount,
        type: updatedAccount.type,
        access_token: updatedAccount.access_token ?? undefined,
        token_type: updatedAccount.token_type ?? undefined,
        id_token: updatedAccount.id_token ?? undefined,
        refresh_token: updatedAccount.refresh_token ?? undefined,
        scope: updatedAccount.scope ?? undefined,
        expires_at: updatedAccount.expires_at ?? undefined,
        session_state: updatedAccount.session_state ?? undefined,
      }
      return account
    },
    getUserByAccount: async (account) => {
      const results = await db
        .select()
        .from(accounts)
        .leftJoin(users, eq(users.id, accounts.userId))
        .where(
          and(
            eq(accounts.provider, account.provider),
            eq(accounts.providerAccountId, account.providerAccountId)
          )
        )
        .get()

      return results?.users ?? null
    },
    deleteSession: async (sessionToken) => {
      return (
        (await db
          .delete(sessions)
          .where(eq(sessions.sessionToken, sessionToken))
          .returning()
          .get()) ?? null
      )
    },
    createVerificationToken: (token) => {
      return db.insert(verificationTokens).values(token).returning().get()
    },
    useVerificationToken: async (token) => {
      try {
        return (
          (await db
            .delete(verificationTokens)
            .where(
              and(
                eq(verificationTokens.identifier, token.identifier),
                eq(verificationTokens.token, token.token)
              )
            )
            .returning()
            .get()) ?? null
        )
      } catch (err) {
        throw new Error("No verification token found.")
      }
    },
    deleteUser: (id) => {
      return db.delete(users).where(eq(users.id, id)).returning().get()
    },
    unlinkAccount: async (account) => {
      await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        )
        .run()

      return undefined
    },
  }
}

export default NextAuth(authOptions)
