import { describe, expect, test } from "vitest"
import { UserController } from "./user.controller"
import { INVALID_USER_EMAIL } from "../data-access/users.test"

describe("users controller", () => {
  test("UserController.getUserIdFromEmail returns user id", async () => {
    const getUserIdFromEmail = UserController.getUserIdFromEmail
    const userId = await getUserIdFromEmail({email: "abdulqshabbir@gmail.com"})
    expect(userId).toEqual("4f8266a3-cc5a-4979-b8a9-9e970b2b7801")
  })
  test("UserController.getUserIdFromEmail to throw if no user found", () => {
    const getUserIdFromEmail = UserController.getUserIdFromEmail
    void expect(() => getUserIdFromEmail({ email: "" })).rejects.toThrowError(/not found/)
  })

  test("UserController.getFriendsByEmail to throw if invalid email", () => {
    const fn = UserController.getUserFriendsByEmail
    expect(() => fn({ email: INVALID_USER_EMAIL })).rejects.toThrow()
  })

})
