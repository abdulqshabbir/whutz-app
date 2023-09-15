import { trpc } from "@/utils/api"
import { friendEmailAtom } from "@/atoms"
import { useAtomValue } from "jotai"

export function useFriendNameAndImage() {
  const friendEmail = useAtomValue(friendEmailAtom)
  const { data } = trpc.friend.getProfileInfo.useQuery(
    {
      friendEmail,
    },
    { enabled: Boolean(friendEmail) }
  )

  return {
    friendImage: data?.image,
    friendName: data?.name,
  }
}
