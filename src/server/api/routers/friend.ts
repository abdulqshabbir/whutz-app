import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

export const friendRouter = createTRPCRouter({
  add: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(({ input }) => {
      console.log("input", input)
      return {
        greeting: `Hello ${input.email}`,
      }
    }),
})
