import type { Config } from "drizzle-kit"
import { env } from "./env.mjs"

export default {
  schema: "./schema/*",
  out: "./src/lib/db",
  driver: "turso",
  dbCredentials: {
    url: env.DB_URL,
    authToken: env.DB_AUTH_TOKEN,
  },
} satisfies Config
