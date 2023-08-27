import { channelAtom, friendEmailAtom, lastMessageRefAtom } from "@/atoms"
import { useUser } from "@/hooks/useUser"
import { cn } from "@/lib/utils"
import { trpc } from "@/utils/api"
import { format, fromUnixTime } from "date-fns"
import { motion } from "framer-motion"
import { useAtomValue } from "jotai"
import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { ChatHistorySkeleton } from "./ui/Skeleton"
import { P } from "./ui/typography/P"

export type Message = {
  id: number
  fromEmail: string
  toEmail: string
  timestamp: number
  type: string
  content: string
  shouldAnimate: boolean
}

const ChatHistory = ({
  messages,
  isMessagesLoading,
}: {
  messages: Message[]
  isMessagesLoading: boolean
}) => {
  const friendEmail = useAtomValue(friendEmailAtom)
  const { email } = useUser()
  const { data } = trpc.friend.getProfileInfo.useQuery(
    {
      friendEmail,
    },
    { enabled: Boolean(friendEmail) }
  )
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
              friendAvatarImage={data?.image ?? ""}
              friendName={data?.name ?? ""}
              isLastMessage={messages?.length - 1 === idx}
            />
          )}
        </React.Fragment>
      ))}
      <div ref={lastMessageRef} className="h-0 w-0"></div>
    </>
  )
}

function ChatWrapper({
  from,
  children,
}: {
  children: React.ReactNode
  from: "FRIEND" | "ME"
}) {
  return (
    <div
      className={cn("min-h-[40px] w-full rounded-md bg-gray-300 p-2", {
        "bg-gray-200": from === "ME",
        "bg-blue-100": from === "FRIEND",
      })}
    >
      {children}
    </div>
  )
}

function ChatText({ children }: { children: React.ReactNode }) {
  return <P className=" text-sm text-gray-900">{children}</P>
}

function ChatTime({ children }: { children: React.ReactNode }) {
  return <P className="min-w-max text-xs text-gray-400">{children}</P>
}

function convertTimestampToTime(timestamp: number) {
  try {
    const result = format(fromUnixTime(timestamp), "hh:mm a")
    return result
  } catch (e) {
    console.error(e)
  }
}

const Wrapper = ({
  children,
  shouldAnimate,
}: {
  children: React.ReactNode
  shouldAnimate: boolean
}) => {
  if (shouldAnimate) {
    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="mx-8 my-4 flex items-start justify-end gap-6"
      >
        {children}
      </motion.div>
    )
  } else {
    return (
      <div className="mx-8 my-4 flex items-start justify-end gap-6">
        {children}
      </div>
    )
  }
}

function UserMessage({
  message,
}: {
  message: Message
  isLastMessage: boolean
}) {
  const { image } = useUser()
  return (
    <Wrapper shouldAnimate={message.shouldAnimate}>
      <ChatWrapper from="ME">
        <ChatText>{message.content}</ChatText>
      </ChatWrapper>
      <div className="flex flex-col items-center gap-1">
        <Avatar>
          <AvatarImage src={image ?? undefined} alt="@shadcn" />
          <AvatarFallback className="bg-gray-300">A</AvatarFallback>
        </Avatar>
        <ChatTime>{convertTimestampToTime(message.timestamp)}</ChatTime>
      </div>
    </Wrapper>
  )
}

function FriendMessage({
  message,
  friendAvatarImage,
  friendName,
}: {
  message: Message
  friendAvatarImage: string
  friendName: string
  isLastMessage: boolean
}) {
  return (
    <Wrapper shouldAnimate={message.shouldAnimate}>
      <div className="flex flex-col items-center gap-1">
        <Avatar>
          <AvatarImage src={friendAvatarImage} alt="@shadcn" />
          <AvatarFallback className="bg-blue-100">
            {friendName.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <ChatTime>{convertTimestampToTime(message.timestamp)}</ChatTime>
      </div>
      <ChatWrapper from="FRIEND">
        <ChatText>{message.content}</ChatText>
      </ChatWrapper>
    </Wrapper>
  )
}

export { ChatHistory }
