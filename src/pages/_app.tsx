import { PusherProvider } from "@/hooks/usePusher"
import { UserProvider } from "@/hooks/queries/useUser"
import "@/styles/globals.css"
import { trpc } from "@/utils/api"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Provider as JotaiProvider } from "jotai"
import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { type AppType } from "next/app"
import { Toaster } from "react-hot-toast"

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
            <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={8}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                // Define default options
                className: "",
                duration: 5000,
                style: {
                  color: "#363636",
                  background: "#fff",
                },
                success: {
                  duration: 3000,
                },
              }}
            />
          </PusherProvider>
        </JotaiProvider>
      </UserProvider>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
