import { getUserByEmailFromDb } from "../data-access/users"
import { getUserFriendsByEmailFromDb } from "../data-access/users"
import { TRPCError } from "@trpc/server"

async function getUserIdFromEmail({
  email,
}: {
  email: string
}): Promise<string | null> {
  const user = await getUserByEmailFromDb(email)
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    })
  }

  return user.id
}

async function getUserFriendsByEmail({
  email,
}: {
  email: string
}) {
  const user = await getUserByEmailFromDb(email)
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    })
  }

  const userFriends = await getUserFriendsByEmailFromDb({
    email,
  })

  return userFriends
}

export const UserController = {
  getUserIdFromEmail,
  getUserFriendsByEmail,
}
