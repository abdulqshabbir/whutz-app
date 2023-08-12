import { sqliteTable, AnySQLiteColumn, integer, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"


export const test = sqliteTable("test", {
	id: integer("id").primaryKey().notNull(),
	text: text("text").notNull(),
});