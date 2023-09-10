import {
  channelAtom,
  lastMessageRefAtom,
  messagesAtom,
  replyToIdAtom,
} from "@/atoms"
import { type Message } from "@/components/ChatRoom/ChatHistory"
import { useIsClient } from "@/hooks/useIsClient"
import { useListenForMessages } from "@/hooks/useListenForMessages"
import { useUser } from "@/hooks/useUser"
import { trpc } from "@/utils/api"
import { useAtomValue, useSetAtom } from "jotai"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { ChatHistory } from "./ChatHistory"
import { ChatInput, type SendMessageInput } from "./ChatInput"

export function ChatRoom() {
  const { isAuthed } = useUser()
  const router = useRouter()
  const isClient = useIsClient()
  const { mutate } = trpc.messages.send.useMutation()
  const messages = useAtomValue(messagesAtom)
  const setReplyToId = useSetAtom(replyToIdAtom)
  const channel = useAtomValue(channelAtom)
  const lastMessageRef = useAtomValue(lastMessageRefAtom)

  // main hook for listening for messages over websockets
  useListenForMessages()

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

  if (isClient && !isAuthed) {
    void router.push("/signup")
  }

  function sendMessage({ ...input }: SendMessageInput) {
    mutate({
      ...input,
    })
    setReplyToId(null)
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
          <ChatInput sendMessage={sendMessage} />
        </div>
      </div>
    </div>
  )
}
