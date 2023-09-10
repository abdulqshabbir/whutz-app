import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar"
import { type Message } from "./ChatHistory"
import { Wrapper, ChatWrapper } from "./MessageWrapper"
import { convertTimestampToTime } from "./utils"
import { EmojiReactions } from "./MessageTypes/EmojiReaction"
import { ChatTime, ChatMessageByType } from "./ChatHistoryHelpers"

export function FriendMessage({
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
    <Wrapper
      messageId={message.id}
      from="FRIEND"
      shouldAnimate={message.shouldAnimate}
    >
      <div className="flex flex-col items-center gap-1">
        <Avatar>
          <AvatarImage src={friendAvatarImage} alt="@shadcn" />
          <AvatarFallback className="bg-blue-100">
            {friendName.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <ChatTime>{convertTimestampToTime(message.timestamp)}</ChatTime>
      </div>
      <div className="flex flex-col items-start">
        <ChatWrapper from="FRIEND">
          <ChatMessageByType message={message} />
        </ChatWrapper>
        <div className="flex gap-2">
          <EmojiReactions emojies={message.emojies} messageId={message.id} />
        </div>
      </div>
    </Wrapper>
  )
}
