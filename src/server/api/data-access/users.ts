import { db } from "@/lib/db"
import { userFriends, users } from "@/lib/db/schema"
import { TRPCError } from "@trpc/server"
import { eq, inArray, sql } from "drizzle-orm"

type User = {
  id: string
  name: string | null
  email: string
  emailVerified: number | null
  image: string | null
}

type UserDto = Pick<User, "id" | "name" | "email" | "emailVerified" | "image">
// type FriendDto = Pick<UserDto, "name" | "email" | "image">

const toUserDto = (user: User): UserDto => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
  } satisfies Partial<User>
}

export const getUserByEmailFromDb = async (
  email: string
): Promise<UserDto | null> => {
  const user = await db.select().from(users).where(eq(users.email, email)).get()
  if (user) return toUserDto(user)
  return null
}

export const getUserFriendsByEmailFromDb = async({
  email,
}: {
  email: string
}) => {
  const user = await getUserByEmailFromDb(email)
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    })
  }
  const userId = user.id
  const friends = await db
    .select({
      image: users.image,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(
      inArray(
        users.id,
        sql`(SELECT ${userFriends.friendId} FROM ${userFriends} WHERE ${userFriends.userId}=${userId}) `
      )
    )
    .all()
  return friends
}
