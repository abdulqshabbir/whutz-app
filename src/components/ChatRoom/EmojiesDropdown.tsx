/* eslint-disable @next/next/no-img-element */
import { trpc, type RouterInputs } from "@/utils/api"
import { cn } from "@/lib/utils"
import { type Dispatch, type SetStateAction } from "react"
import { BsEmojiSunglasses } from "react-icons/bs"

type EmojiType = RouterInputs["messages"]["reactWithEmoji"]["emoji"]
const emojies: Array<{ path: string; value: EmojiType }> = [
  {
    path: "/assets/emojies/thumbs_up.png",
    value: "thumbs_up",
  },
  {
    path: "/assets/emojies/tears_of_joy.png",
    value: "tears_of_joy",
  },
  {
    path: "/assets/emojies/sunglasses.png",
    value: "cool",
  },
  {
    path: "/assets/emojies/fear.png",
    value: "fear",
  },
  {
    path: "/assets/emojies/eyes_heart.png",
    value: "eyes_heart",
  },
]

export function EmojiesDropdown({
  messageId,
  from,
  showEmojiesDropdown,
  setShowEmojiesDropdown,
}: {
  messageId: number
  from: "ME" | "FRIEND"
  showEmojiesDropdown: boolean
  setShowEmojiesDropdown: Dispatch<SetStateAction<boolean>>
}) {
  const utils = trpc.useContext()
  const { mutate: reactWithEmoji } = trpc.messages.reactWithEmoji.useMutation({
    onMutate: () => {
      setShowEmojiesDropdown(false)
    },
    onSuccess: () => {
      void utils.messages.getByChannel.invalidate()
    },
  })
  return (
    <div className="relative cursor-pointer">
      <BsEmojiSunglasses />
      {showEmojiesDropdown && (
        <div
          className={cn(
            `absolute top-8 z-10 flex w-48 flex-col gap-4 rounded-md bg-slate-500 px-2 py-4`,
            {
              "left-[-6px]": from === "ME",
              "right-[-6px]": from === "FRIEND",
            }
          )}
        >
          {emojies.map((e) => {
            return (
              <div
                key={e.value}
                className="flex items-center gap-2 font-bold text-white"
                onClick={() => {
                  reactWithEmoji({
                    emoji: e.value,
                    messageId,
                  })
                }}
              >
                <img width="24px" height="24px" src={e.path} alt="" />
                <p>{e.value}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
