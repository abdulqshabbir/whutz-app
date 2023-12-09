import { channelAtom } from "@/atoms"
import { trpc } from "@/utils/api"
import { useAtomValue } from "jotai"

export function useChannelMessages() {
  const channel = useAtomValue(channelAtom)
  const { data: initialMessages, isLoading: isMessagesLoading } =
    trpc.messages.getByChannel.useQuery(
      {
        channel,
      },
      {
        enabled: Boolean(channel),
        refetchOnWindowFocus: false,
      }
    )
  return {
    initialMessages,
    isMessagesLoading,
  }
}
