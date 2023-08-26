import { trpc } from "@/utils/api"
import { useUser } from "./useUser"

export function useFriends() {
  const { email } = useUser()
  const {
    data: friends,
    isLoading: isFriendsLoading,
    isError: isFriendsError,
  } = trpc.user.getFriendsByEmail.useQuery(
    {
      email: email ?? "",
    },
    { enabled: !!email }
  )

  return {
    friends,
    isFriendsLoading,
    isFriendsError,
  }
}
