import { type Message } from "../ChatHistory"

export function ChatPdfMessage({ message }: { message: Message }) {
  return (
    <object
      data={message.content}
      type="application/pdf"
      width="300px"
      height="500px"
    />
  )
}
