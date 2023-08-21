import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

import { channelAtom, friendEmailAtom, messagesAtom } from "@/pages"
import { trpc } from "@/utils/api"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useAtom, useSetAtom } from "jotai"
import { LogOut, Settings } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { AddFriendDialog } from "./AddFriendDialog"
import { Separator } from "./ui/separator"

export function AccountBarDropdown() {
  const router = useRouter()
  const session = useSession()
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="mt-2 flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full hover:bg-gray-300">
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={session?.data?.user?.image ?? undefined}
                alt="@shadcn"
              />
              <AvatarFallback className="h-12 w-12 rounded-full bg-blue-200 p-4 hover:bg-blue-300">
                AS
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="relative left-4 top-2 w-56">
          <DropdownMenuLabel>
            {session?.data?.user?.name?.split(" ")[0]}&apos;s Account
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
      <FriendsList userEmail={session.data?.user.email ?? null} />
    </>
  )
}

function FriendsList({ userEmail }: { userEmail: string | null }) {
  const [friendEmail, setFriendEmail] = useAtom(friendEmailAtom)
  const [, setChannel] = useAtom(channelAtom)
  const [fetchChannel, setFetchChannel] = useState(false)
  const setMessages = useSetAtom(messagesAtom)

  const { data: userFriends } = trpc.user.getFriendsByEmail.useQuery(
    { email: userEmail ?? "" },
    { enabled: Boolean(userEmail) }
  )
  const { data: channelId } =
    trpc.channel.getChannelByUserAndFriendEmail.useQuery(
      {
        userEmail: userEmail ?? "",
        friendEmail: friendEmail ?? "",
      },
      {
        enabled: fetchChannel,
      }
    )

  useEffect(() => {
    if (friendEmail && userEmail) {
      setFetchChannel(true)
      setChannel("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendEmail, userEmail])

  useEffect(() => {
    setChannel(channelId ?? "")
  }, [channelId, setChannel])

  if (!userFriends) return null

  return userFriends.map((friend) => (
    <div
      key={crypto.randomUUID()}
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
