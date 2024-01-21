import { AccountBar } from "@/components/AccountBar"
import { H1 } from "@/components/ui/typography/H1"
import { P } from "@/components/ui/typography/P"
import Head from "next/head"
import Image from "next/image"
import Script from "next/script"
import { ChatThreadsWrapper } from "@/pages"

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
      <main className="flex h-screen flex-col sm:flex-row">
        <AccountBar />
        <ChatThreadsWrapper />
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <div className="my-8 overflow-hidden rounded-lg">
            <Image src="/assets/icon.png" alt="" width={200} height={200} />
          </div>
          <H1>Welcome how are you?</H1>
          <P className="mb-8">The best place to chat with your friends.</P>
        </div>
      </main>
    </>
  )
}
