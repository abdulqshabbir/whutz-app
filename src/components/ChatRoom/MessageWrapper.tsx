import { cn } from "../../lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"
import { ActionsBar } from "./ActionBar"

export const Wrapper = ({
  children,
  shouldAnimate,
  from,
  messageId,
}: {
  children: React.ReactNode
  shouldAnimate: boolean
  from: "FRIEND" | "ME"
  messageId: number
}) => {
  const [showActions, setShowActions] = useState(false)
  const baseStyles =
    "mx-8 my-4 flex items-start justify-end gap-6 rounded-md p-2 relative"
  if (shouldAnimate) {
    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={cn(baseStyles, {
          "justify-start": from === "FRIEND",
          "bg-slate-200": showActions,
        })}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <ActionsBar show={showActions} from={from} messageId={messageId} />
        {children}
      </motion.div>
    )
  } else {
    return (
      <div
        className={cn(baseStyles, {
          "justify-start": from === "FRIEND",
          "bg-slate-200": showActions,
        })}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <ActionsBar show={showActions} from={from} messageId={messageId} />
        {children}
      </div>
    )
  }
}

export function ChatWrapper({
  from,
  children,
}: {
  children: React.ReactNode
  from: "FRIEND" | "ME"
}) {
  return (
    <div
      className={cn("min-h-[40px] max-w-fit rounded-md bg-gray-300", {
        "bg-gray-300": from === "ME",
        "bg-purple-300": from === "FRIEND",
      })}
    >
      {children}
    </div>
  )
}
