import { PusherProvider } from "@/hooks/usePusher"
import { UserProvider } from "@/hooks/useUser"
import "@/styles/globals.css"
import { trpc } from "@/utils/api"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Provider as JotaiProvider } from "jotai"
import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { type AppType } from "next/app"

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <JotaiProvider>
          <PusherProvider>
            <Component {...pageProps} />
            <ReactQueryDevtools />
          </PusherProvider>
        </JotaiProvider>
      </UserProvider>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
