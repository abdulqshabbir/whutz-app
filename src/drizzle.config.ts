import type { Config } from "drizzle-kit"
import { env } from "./env.mjs"

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db",
  driver: "turso",
  dbCredentials: {
    url: env.DB_URL,
    authToken: env.DB_AUTH_TOKEN,
  },
} satisfies Config
