import { replyToIdAtom } from "@/atoms"
import { cn } from "@/lib/utils"
import { useSetAtom } from "jotai"
import { useState } from "react"
import { BsReply } from "react-icons/bs"
import { EmojiesDropdown } from "./EmojiesDropdown"

export function ActionsBar({
  from,
  show,
  messageId,
}: {
  from: "FRIEND" | "ME"
  show: boolean
  messageId: number
}) {
  const [showEmojiesDropdown, setShowEmojiesDropdown] = useState<boolean>(false)
  const setReplyToId = useSetAtom(replyToIdAtom)
  if (!show) return null
  return (
    <div
      className={cn(
        "absolute top-[-8px] flex cursor-pointer rounded-md bg-slate-300",
        {
          "left-2": from === "ME",
          "right-2": from === "FRIEND",
        }
      )}
    >
      <div
        className="rounded-md p-2 hover:bg-slate-400"
        onClick={() => setShowEmojiesDropdown((prev) => !prev)}
      >
        <EmojiesDropdown
          messageId={messageId}
          from={from}
          showEmojiesDropdown={showEmojiesDropdown}
          setShowEmojiesDropdown={setShowEmojiesDropdown}
        />
      </div>
      <div
        className="rounded-md p-2 hover:bg-slate-400"
        onClick={() => {
          setReplyToId(messageId)
        }}
      >
        <BsReply />
      </div>
    </div>
  )
}
