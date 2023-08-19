import { cn } from "@/lib/utils"
import { trpc } from "@/utils/api"
import { format, fromUnixTime } from "date-fns"
import { useSession } from "next-auth/react"
import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import P from "./ui/typography/P"

export type Message = {
  from: "ME" | "FRIEND"
  timestamp: number
  type: string
  content: string
}

const ChatHistory = ({ messages }: { messages: Message[] }) => {
  const session = useSession()
  const { data } = trpc.friend.getProfileInfo.useQuery({
    channel: "hello-channel",
    friendEmail:
      session.data?.user.email === "abdulqshabbir@gmail.com"
        ? "ashabbir@algomau.ca"
        : "abdulqshabbir@gmail.com",
  })
  return messages?.map((m) => (
    <React.Fragment key={crypto.randomUUID()}>
      {m.from === "ME" ? (
        <UserMessage message={{ ...m }} />
      ) : (
        <FriendMessage
          message={{ ...m }}
          friendAvatarImage={data?.image ?? ""}
          friendName={data?.name ?? ""}
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
  from: Message["from"]
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
  return format(fromUnixTime(timestamp), "hh:mm a")
}

function UserMessage({ message }: { message: Message }) {
  const session = useSession()
  return (
    <div className="mx-8 my-4 flex items-start justify-end gap-6">
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
    </div>
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
}) {
  return (
    <div className="mx-8 my-4 flex items-start justify-start gap-6">
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
    </div>
  )
}

export { ChatHistory }
