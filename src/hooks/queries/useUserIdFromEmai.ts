import { trpc } from "@/utils/api"
import { useUser } from "./useUser"
export function useUserIdFromEmail() {
  const { email } = useUser()
  const { data, error, isError } = trpc.user.getUserIdFromEmail.useQuery(
    {
      email: email ?? "",
    },
    {
      enabled: Boolean(email),
      refetchOnWindowFocus: false,
    }
  )

  return {
    userId: data,
    isError,
    error,
  }
}
