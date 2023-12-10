import { describe, expect, test } from "vitest"
import { getUserByEmail } from "./users"

describe("users data-access", () => {
  test("getUserEmail returns email", async () => {
    const user = await getUserByEmail("abdulqshabbir@gmail.com")

    if (!user) throw new Error("User not found")
    expect(user.email).toBe("abdulqshabbir@gmail.com")
    expect(user.id).toBe("4f8266a3-cc5a-4979-b8a9-9e970b2b7801")
    expect(user.image).toBeDefined()
  })
  test("getUserEmail returns null if no user", async () => {
    const user = await getUserByEmail(
      "asdfasl.kdfjlkasjdlfkjalksdjfkaljdfskjlks"
    )
    expect(user).toBeNull()
  })
})
