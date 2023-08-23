import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog"
import { trpc } from "@/utils/api"
import { UserPlus } from "lucide-react"
import { useState } from "react"
import * as z from "zod"
import { Button } from "./ui/Button"
import { Input } from "./ui/InputField"
import { Label } from "./ui/Label"

const addFriendSchema = z.object({
  email: z.string().email(),
})

export function AddFriendDialog() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const mutation = trpc.user.sendFriendRequest.useMutation({
    onError(error) {
      setError(error.message)
    },
  })
  const onSubmit = (email: string) => {
    const parsedEmail = addFriendSchema.safeParse({ email })
    if (parsedEmail.success) {
      setError("")
      mutation.mutate({ email })
    } else {
      setError(parsedEmail.error.issues?.[0]?.message ?? "Invalid email")
    }
  }
  return (
    <form>
      <AlertDialog>
        <AlertDialogTrigger className="flex h-12 w-12 items-center justify-center hover:rounded-md hover:bg-gray-300">
          <UserPlus size={35} strokeWidth={1} className="relative left-1" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add a friend to WhutzApp!</AlertDialogTitle>
            <AlertDialogDescription className="mb-2">
              Add a friend to WhutzApp by entering their email below.
            </AlertDialogDescription>
            <Label className="text-gray-400">Email: </Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            {error && <Label className="text-red-400">{error}</Label>}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={() => onSubmit(email)} value="Add Friend">
              Add Friend
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  )
}
