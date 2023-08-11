import React from "react"
import { format, fromUnixTime } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import P from "./ui/typography/P"
import { cn } from "@/lib/utils"

type Message = {
  from: "ME" | "FRIEND"
  timestamp: number
  type: "text" | "image" | "video"
  content: string
}

const ChatHistory = ({}) => {
  const messages: Message[] = [
    {
      from: "ME",
      timestamp: 1691759516, // in seconds
      type: "text",
      content:
        "Lorem ipsum lorem lorem lorem Lorem ipsum lorem lorem loremLorem ipsum lorem lorem loremLorem ipsum lorem lorem loremLorem ipsum lorem lorem loremLorem ipsum lorem lorem loremLorem ipsum lorem lorem lorem",
    },
    {
      from: "FRIEND",
      timestamp: 1691759516, // in seconds
      type: "text",
      content:
        "Lorem ipsum lorem lorem lorem Lorem ipsum lorem lorem loremLorem ipsum lorem lorem loremLorem ipsum lorem lorem loremLorem ipsum lorem lorem loremLorem ipsum lorem lorem loremLorem ipsum lorem lorem lorem Lorem ipsum lorem lorem lorem Lorem ipsum lorem lorem loremLorem ipsum lorem lorem loremLorem ipsum lorem lorem loremLorem ipsum lorem lorem loremLorem ipsum lorem lorem loremLorem ipsum lorem lorem lorem",
    },
    {
      from: "ME",
      timestamp: 1691759516, // in seconds
      type: "text",
      content: "Lorem ipsum lorem lorem lorem",
    },
  ]
  return messages.map((m) => (
    <React.Fragment key={crypto.randomUUID()}>
      {m.from === "ME" ? (
        <UserMessage message={{ ...m }} />
      ) : (
        <FriendMessage message={{ ...m }} />
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
      className={cn("min-h-[80px] w-full rounded-md bg-gray-300 p-2", {
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
  return (
    <div className="m-8 flex items-start justify-end gap-6">
      <ChatWrapper from="ME">
        <ChatText>{message.content}</ChatText>
      </ChatWrapper>
      <div className="flex flex-col items-center gap-1">
        <Avatar>
          <AvatarImage
            src="https://github.com/abdulqshabbir.png"
            alt="@shadcn"
          />
          <AvatarFallback className="bg-gray-300">A</AvatarFallback>
        </Avatar>
        <ChatTime>{convertTimestampToTime(message.timestamp)}</ChatTime>
      </div>
    </div>
  )
}

function FriendMessage({ message }: { message: Message }) {
  return (
    <div className="m-8 flex items-start justify-start gap-6">
      <div className="flex flex-col items-center gap-1">
        <Avatar>
          <AvatarImage
            src="htts://github.com/abdulqshabbir.png"
            alt="@shadcn"
          />
          <AvatarFallback className="bg-blue-100">A</AvatarFallback>
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
