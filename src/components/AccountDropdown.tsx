import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

import { channelAtom, friendEmailAtom, messagesAtom } from "@/atoms"
import { useChannelId } from "@/hooks/useChannelId"
import { useFriends } from "@/hooks/useFriends"
import { useUser } from "@/hooks/useUser"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useAtom, useSetAtom } from "jotai"
import { LogOut, Settings } from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { AddFriendDialog } from "./AddFriendDialog"
import { Skeleton } from "./ui/Skeleton"
import { Separator } from "./ui/separator"

export function AccountBarDropdown() {
  const router = useRouter()
  const { image, name } = useUser()
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="mt-2 flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full hover:bg-gray-300">
            l
            <Avatar className="cursor-pointer">
              {!image && <Skeleton />}
              {image && <AvatarImage src={image ?? undefined} alt="@shadcn" />}
              <AvatarFallback className="h-12 w-12 rounded-full bg-blue-200 p-4 hover:bg-blue-300">
                AS
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="relative left-4 top-2 w-56">
          <DropdownMenuLabel>
            {name?.split(" ")[0]}&apos;s Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Settings className="mr-4" />
              <span>Account Settings</span>
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
      <Separator className="w-5/6 bg-gray-300" />
      <FriendsList />
    </>
  )
}

function FriendsList() {
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
      <div>
        <Skeleton className="mb-2 h-12 w-12 rounded-full bg-gray-300 p-4" />
        <Skeleton className="mb-2 h-12 w-12 rounded-full bg-gray-300 p-4" />
        <Skeleton className="mb-2 h-12 w-12 rounded-full bg-gray-300 p-4" />
        <Skeleton className="mb-2 h-12 w-12 rounded-full bg-gray-300 p-4" />
      </div>
    )
  }

  if (isFriendsError || !friends) {
    return null
  }

  return friends.map((friend) => (
    <div
      key={friend.email}
      className={`mt-2 flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full hover:bg-gray-300 ${
        friendEmail === friend.email
          ? " outline outline-4 outline-offset-2 outline-gray-400"
          : ""
      }`}
      onClick={() => {
        setFriendEmail(friend.email)
        setMessages([])
      }}
    >
      <Avatar className="cursor-pointer">
        <AvatarImage src={friend.image ?? ""} alt="@shadcn" />
        <AvatarFallback className="h-12 w-12 rounded-full bg-blue-200 p-4 hover:bg-blue-300">
          {friend.name?.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
    </div>
  ))
}
