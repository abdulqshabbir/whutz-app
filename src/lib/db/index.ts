import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { env } from "@/env.mjs"

const client = createClient({
  url: env.DB_URL,
  authToken: env.DB_AUTH_TOKEN,
})

const db = drizzle(client, { logger: false })
type DrizzleDB = typeof db

export { db, type DrizzleDB }
