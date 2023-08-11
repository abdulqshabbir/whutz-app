import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import P from "./ui/typography/P"

const ChatHistory = ({}) => {
  return (
    <div>
      <UserMessage />
      <FriendMessage />
      <UserMessage />
      <FriendMessage />
      <UserMessage />
      <FriendMessage />
    </div>
  )
}

function ChatText({ children }: { children: React.ReactNode }) {
  return <P className=" text-sm text-gray-600">{children}</P>
}

function ChatTime({ children }: { children: React.ReactNode }) {
  return <P className="text-xs text-gray-400">{children}</P>
}

function UserMessage() {
  return (
    <div className="m-8 flex items-start justify-end gap-4">
      <ChatText>
        Lorem ipsum lorem lorem lorem Lorem ipsum lorem lorem lorem Lorem ipsum
        lorem lorem lorem Lorem ipsum lorem lorem lorem Lorem ipsum lorem lorem
        lorem
      </ChatText>
      <div className="flex flex-col items-center gap-1">
        <Avatar>
          <AvatarImage
            src="https://github.com/abdulqshabbir.png"
            alt="@shadcn"
          />
          <AvatarFallback className="bg-gray-300">A</AvatarFallback>
        </Avatar>
        <ChatTime>4:50</ChatTime>
      </div>
    </div>
  )
}

function FriendMessage() {
  return (
    <div className="m-8 flex items-start justify-start gap-4">
      <div className="flex flex-col items-center gap-1">
        <Avatar>
          <AvatarImage
            src="htts://github.com/abdulqshabbir.png"
            alt="@shadcn"
          />
          <AvatarFallback className="bg-gray-300">A</AvatarFallback>
        </Avatar>
      </div>
      <ChatText>
        Lorem ipsum lorem lorem lorem Lorem ipsum lorem lorem lorem Lorem ipsum
        lorem lorem lorem Lorem ipsum lorem lorem lorem Lorem ipsum lorem lorem
        lorem
      </ChatText>
    </div>
  )
}

export { ChatHistory }
