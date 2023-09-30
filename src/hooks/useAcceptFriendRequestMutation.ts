import { trpc } from "@/utils/api"

export function useAcceptFriendRequestMutation() {
  const { mutate: acceptFriendRequest } =
    trpc.user.acceptFriendRequestV2.useMutation()

  return {
    acceptFriendRequest,
  }
}
