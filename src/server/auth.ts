import { env } from "@/env.mjs"
import { db, type DrizzleDB } from "@/lib/db/dbClient"
import {
  accounts,
  sessions,
  users,
  verificationToken as verificationTokens,
} from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { type GetServerSidePropsContext } from "next"
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth"
import GoogleProvider from "next-auth/providers/google"

function DrizzleAdapter(db: DrizzleDB): NextAuthOptions["adapter"] {
  return {
    createUser: async (data) => {
      const result = await db
        .insert(users)
        .values({
          ...data,
          id: crypto.randomUUID(),
          emailVerified: data.emailVerified
            ? new Date(data.emailVerified).getTime() / 1000
            : null,
        })
        .returning()
        .get()

      return {
        ...result,
        emailVerified: result.emailVerified
          ? new Date(result.emailVerified * 1000)
          : null,
      }
    },
    getUser: async (data) => {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, data))
        .get()

      return result
        ? {
            ...result,
            emailVerified: result.emailVerified
              ? new Date(result.emailVerified * 1000)
              : null,
          }
        : null
    },
    getUserByEmail: async (data) => {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, data))
        .get()
      return result
        ? {
            ...result,
            emailVerified: result.emailVerified
              ? new Date(result.emailVerified * 1000)
              : null,
          }
        : null
    },
    createSession: async (data) => {
      const result = await db
        .insert(sessions)
        .values({
          ...data,
          expires: data.expires.getTime() / 1000,
        })
        .returning()
        .get()

      return {
        ...result,
        expires: new Date(result.expires * 1000),
      }
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
      return result
        ? {
            session: {
              ...result.session,
              expires: new Date(result.session.expires * 1000),
            },
            user: {
              ...result.user,
              emailVerified: result.user.emailVerified
                ? new Date(result.user.emailVerified * 1000)
                : null,
            },
          }
        : null
    },
    updateUser: async (data) => {
      if (!data.id) {
        throw new Error("No user id.")
      }

      const result = await db
        .update(users)
        .set({
          ...data,
          emailVerified: data.emailVerified
            ? data.emailVerified?.getTime() / 1000
            : null,
        })
        .where(eq(users.id, data.id))
        .returning()
        .get()

      return {
        ...result,
        emailVerified: result.emailVerified
          ? new Date(result.emailVerified * 1000)
          : null,
      }
    },
    updateSession: async (data) => {
      const result = await db
        .update(sessions)
        .set({
          ...data,
          expires: data.expires ? data.expires.getTime() / 1000 : undefined,
        })
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .get()

      return {
        ...result,
        expires: new Date(result.expires * 1000),
      }
    },
    linkAccount: async (rawAccount) => {
      await db.insert(accounts).values(rawAccount).returning().get()
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

      return results?.users
        ? {
            id: results.users.id,
            email: results.users.email,
            emailVerified: results?.users?.emailVerified
              ? new Date(results?.users?.emailVerified * 1000)
              : null,
            name: results.users.name,
            image: results.users.image,
          }
        : null
    },
    deleteSession: async (sessionToken) => {
      await db
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .returning()
        .get()
    },
    createVerificationToken: async (token) => {
      const result = await db
        .insert(verificationTokens)
        .values({
          ...token,
          expires: token.expires.getTime() / 1000,
        })
        .returning()
        .get()
      return {
        ...result,
        expires: new Date(result.expires * 1000),
      }
    },
    useVerificationToken: async (token) => {
      try {
        const result = await db
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token)
            )
          )
          .returning()
          .get()

        return result
          ? { ...result, expires: new Date(result.expires * 1000) }
          : null
      } catch (err) {
        throw new Error("No verification token found.")
      }
    },
    deleteUser: async (userId: string) => {
      await db.delete(users).where(eq(users.id, userId)).returning().get()
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

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string
      // ...other properties
      // role: UserRole;
    }
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "database",
  },
  adapter: DrizzleAdapter(db),
  callbacks: {
    session: ({ session }) => {
      return {
        ...session,
        user: {
          ...session.user,
        },
      }
    },
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      checks: ["none"],
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"]
  res: GetServerSidePropsContext["res"]
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
