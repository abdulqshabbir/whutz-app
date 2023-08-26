import {
  channelAtom,
  friendEmailAtom,
  lastMessageRefAtom,
  messagesAtom,
} from "@/atoms"
import { type Message } from "@/components/ChatHistory"
import { env } from "@/env.mjs"
import { useIsClient } from "@/hooks/useIsClient"
import { useUser } from "@/hooks/useUser"
import { trpc, type RouterInputs } from "@/utils/api"
import { useAtom, useAtomValue } from "jotai"
import { useRouter } from "next/router"
import Pusher from "pusher-js"
import { useEffect, useState } from "react"
import { z } from "zod"
import { ChatHistory } from "./ChatHistory"
import { Textarea } from "./ui/TextArea"

type SendMessageInput = RouterInputs["messages"]["send"]

export function ChatRoom() {
  const { isAuthed } = useUser()
  const router = useRouter()
  const isClient = useIsClient()
  const { mutate } = trpc.messages.send.useMutation()
  const [messages, setMessages] = useAtom(messagesAtom)
  const channel = useAtomValue(channelAtom)
  const lastMessageRef = useAtomValue(lastMessageRefAtom)

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, lastMessageRef])

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView()
  }, [channel, lastMessageRef])

  const { data: initialMessages, isLoading: isMessagesLoading } =
    trpc.messages.getByChannel.useQuery(
      {
        channel,
      },
      {
        enabled: Boolean(channel),
        refetchOnWindowFocus: false,
      }
    )
  useEffect(() => {
    if (!isMessagesLoading) {
      lastMessageRef.current?.scrollIntoView()
    }
  }, [isMessagesLoading, lastMessageRef])

  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    })
    const pusherChannel = pusher.subscribe(channel)
    const callback = ({ data }: { data: Message[] }) => {
      console.log("xxx ", data)
      const mappedMessages: Message[] = data.map((m, idx) => {
        if (idx === data.length - 1) {
          return {
            ...m,
            shouldAnimate: true,
          }
        }
        return {
          ...m,
          shouldAnimate: false,
        }
      })

      const messageSchema = z.array(
        z.object({
          timestamp: z.number(),
          type: z.string(),
          content: z.string(),
          fromEmail: z.string().email(),
          toEmail: z.string().email(),
          shouldAnimate: z.boolean(),
        })
      )

      messageSchema.parse(mappedMessages)
      setMessages(mappedMessages)
    }
    pusherChannel.bind("message", callback)
    return () => {
      pusherChannel.unbind("message", callback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel])

  if (isClient && !isAuthed) {
    void router.push("/signup")
  }

  function sendMesage({ ...input }: SendMessageInput) {
    mutate({
      ...input,
    })
  }

  const mappedInitialMessages: Message[] = (initialMessages ?? []).map((m) => ({
    ...m,
    shouldAnimate: false,
  }))
  return (
    <div className="flex h-screen w-full flex-col items-stretch bg-gray-100">
      <div className={`h-[85%] overflow-y-auto`}>
        <ChatHistory
          messages={messages.length === 0 ? mappedInitialMessages : messages}
          isMessagesLoading={isMessagesLoading}
        />
      </div>
      <div className={`h-[15%]`}>
        <div className="m-2">
          <ChatInput sendMesage={sendMesage} />
        </div>
      </div>
    </div>
  )
}

function ChatInput({
  sendMesage,
}: {
  sendMesage: (message: SendMessageInput) => void
}) {
  const { email } = useUser()
  const [newMessage, setNewMessage] = useState("")
  const [friendEmail] = useAtom(friendEmailAtom)
  const [channel] = useAtom(channelAtom)

  return (
    <Textarea
      className="m-0 h-full bg-gray-50 p-4"
      style={{ resize: "none" }}
      placeholder="Write a message"
      value={newMessage}
      onChange={(e) => {
        setNewMessage(e.target.value)
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          if (email) {
            sendMesage({
              fromEmail: email,
              toEmail: friendEmail,
              channel: channel,
              content: newMessage.trimEnd(),
            })
            setNewMessage("")
          }
        }
      }}
    />
  )
}
