import toast from "react-hot-toast"
import { trpc } from "@/utils/api"

export function useAcceptFriendRequestMutation() {
  const utils = trpc.useContext()
  const { mutate: acceptFriendRequest } =
    trpc.user.acceptFriendRequestV2.useMutation({
      onError: (error) => {
        console.error(error)
        toast.error("Something went wrong")
      },
      onSuccess() {
        toast.success("Friend request accepted!")
        void utils.user.getFriendsByEmail.invalidate()
      },
    })

  return {
    acceptFriendRequest,
  }
}
