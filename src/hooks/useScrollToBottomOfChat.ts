import { useEffect } from "react"
import { channelAtom, lastMessageRefAtom, messagesAtom } from "@/atoms"
import { useAtomValue } from "jotai"
import { useChannelMessages } from "./queries/useChannelMessages"

export const useScrollToBottomOfChat = () => {
  const lastMessageRef = useAtomValue(lastMessageRefAtom)
  const messages = useAtomValue(messagesAtom)
  const channel = useAtomValue(channelAtom)

  const { isMessagesLoading } = useChannelMessages()

  // smooth scroll for new message
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, lastMessageRef])

  // jump scroll if channel changes
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView()
  }, [channel, lastMessageRef])

  // jump scroll after messages done loading for first time
  useEffect(() => {
    if (!isMessagesLoading) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView()
      }, 0)
    }
  }, [isMessagesLoading, lastMessageRef])
}
