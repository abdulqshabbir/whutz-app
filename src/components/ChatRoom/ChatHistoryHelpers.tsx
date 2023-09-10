import { P } from "../ui/typography/P"
import { type Message } from "./ChatHistory"
import { ChatImageMessage } from "./MessageTypes/ChatImageMessage"
import { ChatPdfMessage } from "./MessageTypes/ChatPDFMessage"
import { ChatTextMessage } from "./MessageTypes/ChatTextMessage"

export function ChatTime({ children }: { children: React.ReactNode }) {
  return <P className="min-w-max text-xs text-gray-400">{children}</P>
}

export function ChatMessageByType({ message }: { message: Message }) {
  if (message.type === "text") {
    return <ChatTextMessage message={message} />
  }
  if (message.type === "image") {
    return <ChatImageMessage message={message} />
  }
  if (message.type === "pdf") {
    return <ChatPdfMessage message={message} />
  }
}
