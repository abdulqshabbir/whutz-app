/* eslint-disable @next/next/no-img-element */
import { friendEmailAtom, lastMessageRefAtom } from "@/atoms"
import { useUser } from "@/hooks/useUser"
import { cn } from "@/lib/utils"
import { trpc } from "@/utils/api"
import { format, fromUnixTime } from "date-fns"
import { motion } from "framer-motion"
import { useAtomValue } from "jotai"
import React, { type Dispatch, type SetStateAction, useState } from "react"
import { BsEmojiSunglasses, BsReply } from "react-icons/bs"
import { type RouterInputs } from "../utils/api"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { ChatHistorySkeleton } from "./ui/Skeleton"
import { P } from "./ui/typography/P"

export type Message = {
  id: number
  fromEmail: string
  toEmail: string
  timestamp: number
  type: string
  content: string
  shouldAnimate: boolean
  emojies: string | null
}

const ChatHistory = ({
  messages,
  isMessagesLoading,
}: {
  messages: Message[]
  isMessagesLoading: boolean
}) => {
  const friendEmail = useAtomValue(friendEmailAtom)
  const { email } = useUser()
  const { data } = trpc.friend.getProfileInfo.useQuery(
    {
      friendEmail,
    },
    { enabled: Boolean(friendEmail) }
  )
  const lastMessageRef = useAtomValue(lastMessageRefAtom)

  if (isMessagesLoading) {
    return <ChatHistorySkeleton />
  }

  return (
    <>
      {messages?.map((m, idx) => (
        <React.Fragment key={m.id}>
          {m.fromEmail === email ? (
            <UserMessage
              message={m}
              isLastMessage={messages?.length - 1 === idx}
            />
          ) : (
            <FriendMessage
              message={m}
              friendAvatarImage={data?.image ?? ""}
              friendName={data?.name ?? ""}
              isLastMessage={messages?.length - 1 === idx}
            />
          )}
        </React.Fragment>
      ))}
      <div ref={lastMessageRef} className="h-0 w-0"></div>
    </>
  )
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
      className={cn("min-h-[40px] max-w-fit rounded-md bg-gray-300 p-2", {
        "bg-gray-300": from === "ME",
        "bg-purple-300": from === "FRIEND",
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

function ActionsBar({
  from,
  show,
  messageId,
}: {
  from: "FRIEND" | "ME"
  show: boolean
  messageId: number
}) {
  const [showEmojiesDropdown, setShowEmojiesDropdown] = useState<boolean>(false)
  if (!show) return null
  return (
    <div
      className={cn(
        "absolute top-[-8px] flex cursor-pointer rounded-md bg-slate-300",
        {
          "left-2": from === "ME",
          "right-2": from === "FRIEND",
        }
      )}
      onClick={() => setShowEmojiesDropdown((prev) => !prev)}
    >
      <div className="rounded-md p-2 hover:bg-slate-400 ">
        <EmojiesDropdown
          messageId={messageId}
          from={from}
          showEmojiesDropdown={showEmojiesDropdown}
          setShowEmojiesDropdown={setShowEmojiesDropdown}
        />
      </div>
      <div className="rounded-md p-2 hover:bg-slate-400">
        <BsReply />
      </div>
    </div>
  )
}

function EmojiesDropdown({
  messageId,
  from,
  showEmojiesDropdown,
  setShowEmojiesDropdown,
}: {
  messageId: number
  from: "ME" | "FRIEND"
  showEmojiesDropdown: boolean
  setShowEmojiesDropdown: Dispatch<SetStateAction<boolean>>
}) {
  const utils = trpc.useContext()
  const { mutate: reactWithEmoji } = trpc.messages.reactWithEmoji.useMutation({
    onMutate: () => {
      setShowEmojiesDropdown(false)
    },
    onSuccess: () => {
      void utils.messages.getByChannel.invalidate()
    },
  })
  type EmojiType = RouterInputs["messages"]["reactWithEmoji"]["emoji"]
  const emojies: Array<{ path: string; value: EmojiType }> = [
    {
      path: "/assets/emojies/thumbs_up.png",
      value: "thumbs_up",
    },
    {
      path: "/assets/emojies/tears_of_joy.png",
      value: "tears_of_joy",
    },
    {
      path: "/assets/emojies/sunglasses.png",
      value: "cool",
    },
    {
      path: "/assets/emojies/fear.png",
      value: "fear",
    },
    {
      path: "/assets/emojies/eyes_heart.png",
      value: "eyes_heart",
    },
  ]
  return (
    <div className="relative cursor-pointer">
      <BsEmojiSunglasses />
      {showEmojiesDropdown && (
        <div
          className={cn(
            `absolute top-8 z-10 flex w-48 flex-col gap-4 rounded-md bg-slate-500 px-2 py-4`,
            {
              "left-[-6px]": from === "ME",
              "right-[-6px]": from === "FRIEND",
            }
          )}
        >
          {emojies.map((e) => {
            return (
              <div
                key={e.value}
                className="flex items-center gap-2 font-bold text-white"
                onClick={() => {
                  reactWithEmoji({
                    emoji: e.value,
                    messageId,
                  })
                }}
              >
                <img width="24px" height="24px" src={e.path} alt="" />
                <p>{e.value}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const Wrapper = ({
  children,
  shouldAnimate,
  from,
  messageId,
}: {
  children: React.ReactNode
  shouldAnimate: boolean
  from: "FRIEND" | "ME"
  messageId: number
}) => {
  const [showActions, setShowActions] = useState(false)
  const baseStyles =
    "mx-8 my-4 flex items-start justify-end gap-6 rounded-md p-2 relative"
  if (shouldAnimate) {
    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={cn(baseStyles, {
          "justify-start": from === "FRIEND",
          "bg-slate-200": showActions,
        })}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <ActionsBar show={showActions} from={from} messageId={messageId} />
        {children}
      </motion.div>
    )
  } else {
    return (
      <div
        className={cn(baseStyles, {
          "justify-start": from === "FRIEND",
          "bg-slate-200": showActions,
        })}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <ActionsBar show={showActions} from={from} messageId={messageId} />
        {children}
      </div>
    )
  }
}

function ChatTextMessage({ message }: { message: Message }) {
  return <ChatText>{message.content}</ChatText>
}

function ChatImageMessage({ message }: { message: Message }) {
  return (
    <a href={message.content} target="_blank">
      <img alt="" src={message.content} width="300px" height="auto" />
    </a>
  )
}

function ChatPdfMessage({ message }: { message: Message }) {
  return (
    <object
      data={message.content}
      type="application/pdf"
      width="300px"
      height="500px"
    />
  )
}

function UserMessage({
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
          {message.type === "text" && <ChatTextMessage message={message} />}
          {message.type === "image" && <ChatImageMessage message={message} />}
          {message.type === "pdf" && <ChatPdfMessage message={message} />}
        </ChatWrapper>
        <div className="flex gap-2">
          <MessageEmojies emojies={message.emojies} messageId={message.id} />
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

function MessageEmojies({
  emojies,
  messageId,
}: {
  emojies: string | null
  messageId: number
}) {
  if (!emojies) return null

  const emojiesArray = emojies.split(",")
  return emojiesArray.map((emoji) => (
    <img
      key={`${emoji}-${messageId}`}
      src={`/assets/emojies/${emoji}.png`}
      alt=""
      width="25px"
      className="my-1 rounded-md bg-amber-800 p-1"
    />
  ))
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
          {message.type === "text" && <ChatTextMessage message={message} />}
          {message.type === "image" && <ChatImageMessage message={message} />}
          {message.type === "pdf" && <ChatPdfMessage message={message} />}
        </ChatWrapper>
        <div className="flex gap-2">
          <MessageEmojies emojies={message.emojies} messageId={message.id} />
        </div>
      </div>
    </Wrapper>
  )
}

export { ChatHistory }
