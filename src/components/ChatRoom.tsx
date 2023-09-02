import {
  channelAtom,
  friendEmailAtom,
  lastMessageRefAtom,
  messagesAtom,
} from "@/atoms"
import { type Message } from "@/components/ChatHistory"
import { useIsClient } from "@/hooks/useIsClient"
import { usePusher } from "@/hooks/usePusher"
import { useUser } from "@/hooks/useUser"
import { trpc, type RouterInputs } from "@/utils/api"
import { useAtom, useAtomValue } from "jotai"
import { useRouter } from "next/router"
import { type Channel } from "pusher-js"
import { useEffect, useRef, useState } from "react"
import { GrAttachment } from "react-icons/gr"
import { z } from "zod"
import { ChatHistory } from "./ChatHistory"
import { Input } from "./ui/InputField"
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

    function bindWithChunking(
      channel: Channel,
      event: string,
      callback: ({ data }: { data: Message[] }) => void
    ) {
      pusherChannel.bind("message", callback)
      const events: Record<string, unknown> = {}
      type ChunkedData = {
        id: string
        index: number
        chunk: string
        final: boolean
      }
      channel.bind("chunked-" + event, (data: ChunkedData) => {
        if (!events.hasOwnProperty(data.id)) {
          events[data.id] = { chunks: [], receivedFinal: false }
        }
        type EventChunks = {
          chunks: string[]
          receivedFinal: boolean
        }
        const ev = events[data.id] as EventChunks
        ev.chunks[data.index] = data.chunk
        if (data.final) ev.receivedFinal = true
        if (
          ev.receivedFinal &&
          ev.chunks.length === Object.keys(ev.chunks).length
        ) {
          callback({
            data: JSON.parse(ev.chunks.join("")) as unknown as Message[],
          })
          delete events[data.id]
        }
      })
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

function ChatInput({
  sendMessage,
}: {
  sendMessage: (message: SendMessageInput) => void
}) {
  const { email } = useUser()
  const [newMessage, setNewMessage] = useState("")
  const [friendEmail] = useAtom(friendEmailAtom)
  const [channel] = useAtom(channelAtom)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const presignedPostMutation = trpc.s3.createPreSignedPostUrl.useMutation()
  const { data: userId } = trpc.user.getUserIdFromEmail.useQuery({
    email: email ?? "",
  })

  async function uploadToS3(file: File | undefined) {
    if (!file) return

    const result = await presignedPostMutation.mutateAsync()

    if (!result.ok || !result.presignedFields || !result.presignedUrl) return

    const fields = {
      ...result.presignedFields,
      file,
      "Content-Type": file.type,
    }
    const url = result.presignedUrl

    const formData = new FormData()
    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, value)
    }
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        if (email && userId) {
          sendMessage({
            fromEmail: email,
            toEmail: friendEmail,
            channel,
            content: `${url}${userId}/${result.fileId}`,
            type: "image",
          })
        }
      })
      .catch((e) => {
        console.error(e)
        return
      })
  }

  return (
    <div className="relative">
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
              sendMessage({
                fromEmail: email,
                toEmail: friendEmail,
                channel: channel,
                content: newMessage.trimEnd(),
                type: "text",
              })
              setNewMessage("")
            }
          }
        }}
      />
      <GrAttachment
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          cursor: "pointer",
        }}
        onClick={() => {
          fileInputRef.current?.click()
        }}
      />
      <Input
        type="file"
        ref={fileInputRef}
        onChange={(e) => void uploadToS3(e.target.files?.[0])}
        style={{
          display: "none",
        }}
      />
    </div>
  )
}
