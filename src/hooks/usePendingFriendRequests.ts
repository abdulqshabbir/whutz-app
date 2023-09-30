import { trpc } from "@/utils/api"

export function usePendingFriendRequets() {
  const {
    data: pendingFriends,
    isLoading: isPendingFriendsLoading,
    isError: isPendingFriendsError,
  } = trpc.user.getPendingFriendRequests.useQuery()

  return {
    pendingFriends,
    isPendingFriendsLoading,
    isPendingFriendsError,
  }
}
