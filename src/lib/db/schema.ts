/* eslint-disable no-var */
import { sql } from "drizzle-orm"
import {
  integer,
  numeric,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core"

export var accounts = sqliteTable(
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

export var sessions = sqliteTable("sessions", {
  sessionToken: text("sessionToken").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires").notNull(),
})

export var test = sqliteTable("test", {
  id: integer("id").primaryKey().notNull(),
  text: text("text").notNull(),
})

export var users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified"),
  image: text("image"),
})

export var verificationToken = sqliteTable(
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

export var messages = sqliteTable("messages", {
  id: integer("id").primaryKey().notNull(),
  sender: integer("sender").notNull(),
  reciever: integer("reciever").notNull(),
  channel: integer("channel").notNull(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  timestamp: numeric("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
})
