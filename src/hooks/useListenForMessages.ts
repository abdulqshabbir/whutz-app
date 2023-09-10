import { channelAtom, messagesAtom } from "@/atoms"
import { type Message } from "@/components/ChatRoom/ChatHistory"
import { bindWithChunking } from "@/components/ChatRoom/utils"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { z } from "zod"
import { usePusher } from "./usePusher"

export function useListenForMessages() {
  const pusher = usePusher()
  const channel = useAtomValue(channelAtom)
  const setMessages = useSetAtom(messagesAtom)

  if (!pusher) {
    throw new Error("usePusher should be used inside of Pusher Provider")
  }

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
    return () => {
      pusherChannel.unbind("chunked-message", callback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel])
}
