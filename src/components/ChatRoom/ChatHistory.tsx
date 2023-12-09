import { lastMessageRefAtom } from "@/atoms"
import { useFriendNameAndImage } from "@/hooks/queries/useFriendNameAndEmail"
import { useUser } from "@/hooks/queries/useUser"
import { useAtomValue } from "jotai"
import React from "react"
import { ChatHistorySkeleton } from "../ui/Skeleton"
import { FriendMessage } from "./FriendMessage"
import { UserMessage } from "./UserMessage"

export type Message = {
  id: number
  fromEmail: string
  toEmail: string
  timestamp: number
  type: string
  content: string
  shouldAnimate: boolean
  emojies: string | null
  replyToId: number | null
  replyToContent: string | null
  replyToType: string | null
}

const ChatHistory = ({
  messages,
  isMessagesLoading,
}: {
  messages: Message[]
  isMessagesLoading: boolean
}) => {
  const { email } = useUser()
  const { friendImage, friendName } = useFriendNameAndImage()
  const lastMessageRef = useAtomValue(lastMessageRefAtom)

  if (isMessagesLoading) {
    return <ChatHistorySkeleton />
  }

  return (
    <>
      {messages?.map((m, idx) => (
        <React.Fragment key={m.id}>
          {m.fromEmail === email ? (
            <UserMessage
              message={m}
              isLastMessage={messages?.length - 1 === idx}
            />
          ) : (
            <FriendMessage
              message={m}
              friendAvatarImage={friendImage ?? ""}
              friendName={friendName ?? ""}
              isLastMessage={messages?.length - 1 === idx}
            />
          )}
        </React.Fragment>
      ))}
      <div ref={lastMessageRef} className="h-0 w-0"></div>
    </>
  )
}

export { ChatHistory }
