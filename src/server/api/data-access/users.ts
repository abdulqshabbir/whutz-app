import { db } from "@/lib/db"
import { users, type User } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

type UserDto = Pick<User, "id" | "name" | "email" | "emailVerified" | "image">

const toUserDto = (user: User): UserDto => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
  }
}

export const getUserByEmail = async (
  email: string
): Promise<UserDto | null> => {
  const user = await db.select().from(users).where(eq(users.email, email)).get()
  if (user) return toUserDto(user)
  return null
}
