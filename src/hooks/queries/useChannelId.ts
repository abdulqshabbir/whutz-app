import { trpc } from "@/utils/api"
import { useUser } from "./useUser"

type UserFriendsProps = {
  friendEmail: string | null
  shouldFetch: boolean
}

export function useChannelId({ friendEmail, shouldFetch }: UserFriendsProps) {
  const { email: userEmail } = useUser()
  const {
    data: channelId,
    isLoading: channelIdLoading,
    isError: channelIdError,
  } = trpc.channel.getChannelByUserAndFriendEmail.useQuery(
    {
      userEmail: userEmail ?? "",
      friendEmail: friendEmail ?? "",
    },
    {
      enabled: shouldFetch,
    }
  )

  return {
    channelId,
    channelIdLoading,
    channelIdError,
  }
}
