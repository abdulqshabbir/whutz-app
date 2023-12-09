import { createContext, useContext } from "react"
import { env } from "@/env.mjs"
import Pusher from "pusher-js"
import { logger } from "@/utils/logger"
import { useUser } from "./queries/useUser"

const PusherContext = createContext<null | Pusher>(null)
let pusherCached: null | Pusher = null

function usePusher() {
  const pusher = useContext(PusherContext)
  if (!pusher) {
    throw new Error("usePusher hook must be inside of a PusherProvider!")
  }
  return useContext(PusherContext)
}

function PusherProvider({ children }: { children: React.ReactNode }) {
  const { email } = useUser()
  if (!pusherCached) {
    pusherCached = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    })
    logger({
      message: "new pusher client created",
      level: "warn",
      data: null,
      email,
    })
  }

  return (
    <PusherContext.Provider value={pusherCached}>
      {children}
    </PusherContext.Provider>
  )
}

export { usePusher, PusherProvider }
