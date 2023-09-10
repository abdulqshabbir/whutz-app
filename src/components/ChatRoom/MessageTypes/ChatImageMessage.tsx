/* eslint-disable @next/next/no-img-element */
import { type Message } from "../ChatHistory"

export function ChatImageMessage({ message }: { message: Message }) {
  return (
    <a href={message.content} target="_blank">
      <img alt="" src={message.content} width="300px" height="auto" />
    </a>
  )
}
