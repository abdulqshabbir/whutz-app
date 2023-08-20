import { sql } from "drizzle-orm"
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const accounts = sqliteTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => {
    return {
      pk0: primaryKey(table.provider, table.providerAccountId),
    }
  }
)

export const sessions = sqliteTable("sessions", {
  sessionToken: text("sessionToken").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires").notNull(),
})

export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified"),
  image: text("image"),
})

export const verificationToken = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires").notNull(),
  },
  (table) => {
    return {
      pk0: primaryKey(table.identifier, table.token),
    }
  }
)

export const userFriends = sqliteTable(
  "userFriends",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    friendId: text("friendId")
      .notNull()
      .references(() => users.id),
    channelId: text("channelId")
      .notNull()
      .references(() => channels.id),
  },
  (table) => {
    return {
      pk0: primaryKey(table.friendId, table.userId),
    }
  }
)

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey().notNull(),
  sender: text("sender")
    .notNull()
    .references(() => users.id),
  reciever: text("reciever")
    .notNull()
    .references(() => users.id),
  channel: text("channel")
    .notNull()
    .references(() => channels.id),
  type: text("type").notNull(),
  content: text("content").notNull(),
  timestamp: integer("timestamp")
    .default(sql`(unixepoch())`)
    .notNull(),
})

export const channels = sqliteTable("channels", {
  id: text("id").primaryKey().notNull(),
})
