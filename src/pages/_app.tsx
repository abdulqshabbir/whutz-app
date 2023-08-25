import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { type AppType } from "next/app"
import { trpc } from "@/utils/api"
import "@/styles/globals.css"
import { Provider as JotaiProvider } from "jotai"
import { UserProvider } from "@/hooks/useUser"

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <JotaiProvider>
          <Component {...pageProps} />
        </JotaiProvider>
      </UserProvider>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
