import {
  channelAtom,
  lastMessageRefAtom,
  messagesAtom,
  replyToIdAtom,
} from "@/atoms"
import { type Message } from "@/components/ChatRoom/ChatHistory"
import { useIsClient } from "@/hooks/useIsClient"
import { usePusher } from "@/hooks/usePusher"
import { useUser } from "@/hooks/useUser"
import { trpc } from "@/utils/api"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { z } from "zod"
import { ChatHistory } from "./ChatHistory"
import { ChatInput, type SendMessageInput } from "./ChatInput"
import { bindWithChunking } from "./utils"

export function ChatRoom() {
  const { isAuthed } = useUser()
  const router = useRouter()
  const isClient = useIsClient()
  const { mutate } = trpc.messages.send.useMutation()
  const [messages, setMessages] = useAtom(messagesAtom)
  const setReplyToId = useSetAtom(replyToIdAtom)
  const channel = useAtomValue(channelAtom)
  const lastMessageRef = useAtomValue(lastMessageRefAtom)
  const pusher = usePusher()

  if (!pusher) {
    throw new Error("usePusher should be used inside of Pusher Provider")
  }

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
    const pusherChannel = pusher.subscribe(channel)
    const callback = ({ data }: { data: Message[] }) => {
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

    bindWithChunking(pusherChannel, "message", callback)
    // pusherChannel.bind("message", callback)
    return () => {
      // pusherChannel.unbind("message", callback)
      pusherChannel.unbind("chunked-message", callback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel])

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
