import { useUser } from "@/hooks/useUser"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar"
import { Wrapper, ChatWrapper } from "./MessageWrapper"
import { type Message } from "./ChatHistory"
import { convertTimestampToTime } from "./utils"
import { EmojiReactions } from "./MessageTypes/EmojiReaction"
import { ChatMessageByType, ChatTime } from "./ChatHistoryHelpers"

export function UserMessage({
  message,
}: {
  message: Message
  isLastMessage: boolean
}) {
  const { image } = useUser()
  return (
    <Wrapper
      messageId={message.id}
      from="ME"
      shouldAnimate={message.shouldAnimate}
    >
      <div className="flex flex-col items-end">
        <ChatWrapper from="ME">
          <ChatMessageByType message={message} />
        </ChatWrapper>
        <div className="flex gap-2">
          <EmojiReactions emojies={message.emojies} messageId={message.id} />
        </div>
      </div>
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
