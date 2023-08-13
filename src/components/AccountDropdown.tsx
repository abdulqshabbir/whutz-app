import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"

export function AccountBarDropdown() {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="mt-2 flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full hover:bg-gray-300">
          <Avatar className="cursor-pointer">
            <AvatarImage
              src="https://github.com/abdulqshabbir.png"
              alt="@shadcn"
            />
            <AvatarFallback className="h-12 w-12 rounded-full bg-blue-200 p-4 hover:bg-blue-300">
              AS
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="relative left-4 top-2 w-56">
        <DropdownMenuLabel>Abdul&apos;s Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Account Settings</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              void signOut().then(() => router.push("/signup"))
            }}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
