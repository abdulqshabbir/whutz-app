import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

import { useUser } from "@/hooks/queries/useUser"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { LogOut, Settings, Users, MessageSquare, Book } from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { AddFriendDialog } from "./AddFriendDialog"
import { AvatarSkeleton } from "./ui/Skeleton"
import { Separator } from "./ui/separator"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import {
  channelAtom,
  friendEmailAtom,
  messagesAtom,
  sidebarPageAtom,
} from "@/atoms"
import { useChannelId } from "@/hooks/queries/useChannelId"
import { useEffect } from "react"
import { useFriends } from "@/hooks/queries/useFriends"
import { P } from "./ui/typography/P"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function AccountBarDropdown() {
  const router = useRouter()
  const { image, name } = useUser()
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="mt-2 flex max-h-[3rem] min-h-[2rem] min-w-[2rem] max-w-[3rem] cursor-pointer items-center justify-center overflow-hidden rounded-full hover:bg-gray-300">
            {image && (
              <Avatar className="cursor-pointer">
                <AvatarImage src={image ?? undefined} alt="@shadcn" />
                <AvatarFallback className="max-h-[3rem] min-h-[2rem] min-w-[2rem] max-w-[3rem] rounded-full bg-blue-200 p-4 hover:bg-blue-300">
                  AS
                </AvatarFallback>
              </Avatar>
            )}
            {!image && <AvatarSkeleton />}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="relative left-4 top-2 w-56">
          <DropdownMenuLabel>
            {name?.split(" ")[0]}&apos;s Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="hidden sm:flex" />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Settings className="mr-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                void router.push("friend-invitations")
              }}
            >
              <Users className="mr-4" />
              <span>Friend Invitations</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                void signOut().then(() => router.push("/signup"))
              }}
            >
              <LogOut className="mr-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddFriendDialog />
      <Separator className="hidden w-5/6 bg-gray-300 sm:flex" />
      <ChatsLink />
      <UsersLink />
      <UsersBioLink />
      <SettingsLink />
    </>
  )
}

export function ChatThreads() {
  const [friendEmail, setFriendEmail] = useAtom(friendEmailAtom)
  const setMessages = useSetAtom(messagesAtom)
  const setChannel = useSetAtom(channelAtom)
  const { channelId } = useChannelId({
    friendEmail,
    shouldFetch: Boolean(friendEmail),
  })

  const { friends, isFriendsError, isFriendsLoading } = useFriends()

  useEffect(() => {
    setChannel(channelId ?? "")
  }, [channelId, setChannel])

  if (isFriendsLoading) {
    return (
      <div className="flex gap-2 sm:flex-col sm:gap-4">
        <AvatarSkeleton />
        <AvatarSkeleton />
        <AvatarSkeleton />
        <AvatarSkeleton />
      </div>
    )
  }

  if (isFriendsError || !friends) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      {friends.map((friend) => (
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex items-center gap-8 rounded-md p-3 hover:cursor-pointer hover:bg-gray-100",
            friend.email === friendEmail ? "bg-gray-200" : ""
          )}
          key={friend.email}
          onClick={() => {
            setFriendEmail(friend.email)
            setMessages([])
          }}
        >
          <div
            className={`flex max-h-[3rem] min-h-[2rem] min-w-[2rem] max-w-[3rem] cursor-pointer items-center justify-center overflow-hidden rounded-full`}
          >
            <Avatar className="cursor-pointer">
              <AvatarImage src={friend.image ?? ""} alt="@shadcn" />
              <AvatarFallback className="max-h-[3rem] min-h-[2rem] min-w-[2rem] max-w-[3rem] rounded-full bg-blue-200 p-4 hover:bg-blue-300">
                {friend.name?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col">
            <P className="text-lg font-light">{friend.name}</P>
            <P className="text-sm text-gray-500">Last Chat: some time</P>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

type LinkWrapperProps = JSX.IntrinsicElements["div"] & {
  children: React.ReactNode
  isActive: boolean
}

function LinkWrapper({ children, isActive, ...props }: LinkWrapperProps) {
  return (
    <div
      {...props}
      className="relative flex w-full items-center justify-center py-3 hover:cursor-pointer hover:bg-gray-300"
    >
      {isActive && (
        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500"></div>
      )}
      {children}
    </div>
  )
}

function ChatsLink() {
  const setSidebarPage = useSetAtom(sidebarPageAtom)
  const sidebarPage = useAtomValue(sidebarPageAtom)
  return (
    <LinkWrapper
      onClick={() => setSidebarPage("chats")}
      isActive={sidebarPage === "chats"}
    >
      <MessageSquare />
    </LinkWrapper>
  )
}

function UsersLink() {
  const setSidebarPage = useSetAtom(sidebarPageAtom)
  const sidebarPage = useAtomValue(sidebarPageAtom)
  return (
    <LinkWrapper
      onClick={() => setSidebarPage("users")}
      isActive={sidebarPage === "users"}
    >
      <Users />
    </LinkWrapper>
  )
}

function UsersBioLink() {
  const setSidebarPage = useSetAtom(sidebarPageAtom)
  const sidebarPage = useAtomValue(sidebarPageAtom)
  return (
    <LinkWrapper
      onClick={() => setSidebarPage("bio")}
      isActive={sidebarPage === "bio"}
    >
      <Book />
    </LinkWrapper>
  )
}

function SettingsLink() {
  const setSidebarPage = useSetAtom(sidebarPageAtom)
  const sidebarPage = useAtomValue(sidebarPageAtom)
  return (
    <LinkWrapper
      onClick={() => setSidebarPage("settings")}
      isActive={sidebarPage === "settings"}
    >
      <Settings />
    </LinkWrapper>
  )
}
