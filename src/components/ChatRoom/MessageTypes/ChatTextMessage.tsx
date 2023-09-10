import { type Message } from "../ChatHistory"
import { P } from "@/components/ui/typography/P"
import { cn } from "@/lib/utils"

function ChatText({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <P className={cn(`p-2 text-sm text-gray-900`, className)}>{children}</P>
  )
}

export function ChatTextMessage({ message }: { message: Message }) {
  if (message.replyToId) {
    return <ChatReplyWithText message={message} />
  }
  return <ChatText>{message.content}</ChatText>
}
export function ChatReplyWithText({ message }: { message: Message }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-start rounded-t-md bg-slate-400 text-right">
        <div className="h-[100%] min-h-[35px] w-1 rounded-tl-md bg-slate-800"></div>
        <ChatText className="text-gray-900">{message.replyToContent}</ChatText>
      </div>
      <ChatText>{message.content}</ChatText>
    </div>
  )
}
