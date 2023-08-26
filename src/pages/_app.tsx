import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { type AppType } from "next/app"
import { trpc } from "@/utils/api"
import "@/styles/globals.css"
import { Provider as JotaiProvider } from "jotai"
import { UserProvider } from "@/hooks/useUser"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <JotaiProvider>
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </JotaiProvider>
      </UserProvider>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
