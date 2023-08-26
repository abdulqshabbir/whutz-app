import { useSession } from "next-auth/react"
import React, { useContext } from "react"
import { z } from "zod"

type User = {
  isAuthed: boolean
  isLoading: boolean
  email: string | null
  image: string | null
  name: string | null
}

const UserContext = React.createContext<User>({} as User)

export function useUser() {
  if (UserContext === null) {
    throw Error(
      "useUser hook must be used inside of a component that is wrapped in a UserProvider"
    )
  }
  return useContext(UserContext)
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const session = useSession()

  const userSchema = z.object({
    isAuthed: z.boolean(),
    isLoading: z.boolean(),
    email: z.string().email().nullable(),
    image: z.string().nullable(),
    name: z.string().nullable(),
  })

  const user: User = {
    isAuthed: session.status === "authenticated",
    isLoading: session.status === "loading",
    email: session.data?.user?.email ?? null,
    image: session.data?.user?.image ?? null,
    name: session.data?.user.name ?? null,
  }

  userSchema.parse(user)

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
