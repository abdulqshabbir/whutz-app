/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/*
  There seems to be a bug in the types for the drizzle-adapter and next-auth
  which is why we have to use `any` in some places.
*/

import { authOptions } from "@/server/auth"
import NextAuth from "next-auth"

export default NextAuth(authOptions)
