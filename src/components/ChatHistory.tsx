import { cn } from "@/lib/utils"
import { channelAtom, friendEmailAtom } from "@/pages"
import { trpc } from "@/utils/api"
import { format, fromUnixTime } from "date-fns"
import { useAtomValue } from "jotai"
import { useSession } from "next-auth/react"
import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import P from "./ui/typography/P"
import { motion } from "framer-motion"

export type Message = {
  fromEmail: string
  toEmail: string
  timestamp: number
  type: string
  content: string
  shouldAnimate: boolean
}

const ChatHistory = ({ messages }: { messages: Message[] }) => {
  const channel = useAtomValue(channelAtom)
  const friendEmail = useAtomValue(friendEmailAtom)
  const session = useSession()
  const { data } = trpc.friend.getProfileInfo.useQuery({
    channel,
    friendEmail,
  })
  return messages?.map((m, idx) => (
    <React.Fragment key={crypto.randomUUID()}>
      {m.fromEmail === session?.data?.user?.email ? (
        <UserMessage message={m} isLastMessage={messages?.length - 1 === idx} />
      ) : (
        <FriendMessage
          message={m}
          friendAvatarImage={data?.image ?? ""}
          friendName={data?.name ?? ""}
          isLastMessage={messages?.length - 1 === idx}
        />
      )}
    </React.Fragment>
  ))
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
  const session = useSession()
  return (
    <Wrapper shouldAnimate={message.shouldAnimate}>
      <ChatWrapper from="ME">
        <ChatText>{message.content}</ChatText>
      </ChatWrapper>
      <div className="flex flex-col items-center gap-1">
        <Avatar>
          <AvatarImage
            src={session?.data?.user?.image ?? undefined}
            alt="@shadcn"
          />
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
