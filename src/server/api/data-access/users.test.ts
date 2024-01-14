import { describe, expect, test } from "vitest"
import { getUserByEmailFromDb, getUserFriendsByEmailFromDb } from "./users"

export const MY_USER_ID = "4f8266a3-cc5a-4979-b8a9-9e970b2b7801"
export const MY_USER_EMAIL = "abdulqshabbir@gmail.com"

export const MY_FRIENDS_ID = "0f041948-280b-4004-b81f-89ece48da5ab"
export const MY_FRIENDS_EMAIL = "ashabbir@algomau.ca"
export const MY_FRIENDS_NAME = "Abdul Shabbir"
export const MY_FRIENDS_IMAGE = "https://lh3.googleusercontent.com/a/AAcHTtc7MXwCHF-QkzYngg_oyLv55KBKUYp8kzky9OStNIW7=s96-c"

export const INVALID_USER_ID = "asdfasaasdfasdf"
export const INVALID_USER_EMAIL = "asdfas"


describe("users data-access", () => {
  test("getUserEmail returns email", async () => {
    const user = await getUserByEmailFromDb(MY_USER_EMAIL)

    if (!user) throw new Error("User not found")
    expect(user.email).toBe(MY_USER_EMAIL)
    expect(user.id).toBe(MY_USER_ID)
    expect(user.image).toBeDefined()
  })
  test("getUserEmail returns null if no user", async () => {
    const user = await getUserByEmailFromDb(INVALID_USER_EMAIL)
    expect(user).toBeNull()
  })
  test("getUserFriendsByEmail to return a list of friends", async () => {
    const friends = await getUserFriendsByEmailFromDb({
      email: MY_USER_EMAIL
    })
    expect(friends).toContainEqual({
      image: MY_FRIENDS_IMAGE,
      name: MY_FRIENDS_NAME,
      email: MY_FRIENDS_EMAIL,
    })
  })
  test("getUserFriendsByEmail to throw if invalid user", () => {
    expect(async () => await getUserFriendsByEmailFromDb({
      email: INVALID_USER_EMAIL
    })).rejects.toThrow()
  })
})
