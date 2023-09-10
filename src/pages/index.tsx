import { ChatRoom } from "@/components/ChatRoom"
import Head from "next/head"
import Script from "next/script"
import { AccountBar } from "@/components/AccountBar"

export default function Page() {
  return (
    <>
      <Head>
        <title>Whutz-App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script src="https://js.pusher.com/8.2.0/pusher.min.js" />
      <main className="flex h-screen flex-row flex-col sm:flex-row">
        <AccountBar />
        <ChatRoom />
      </main>
    </>
  )
}
