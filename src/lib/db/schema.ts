import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const test = sqliteTable("test", {
  id: integer("id").primaryKey().notNull(),
  text: text("text").notNull(),
})
