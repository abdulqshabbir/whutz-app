import { trpc } from "@/utils/api"

export function usePendingInvitations() {
  const {
    data: pendingFriends,
    isLoading: isPendingFriendsLoading,
    isError: isPendingFriendsError,
  } = trpc.user.getPendingInvitations.useQuery()

  return {
    pendingFriends: pendingFriends ?? [],
    isPendingFriendsLoading,
    isPendingFriendsError,
  }
}
