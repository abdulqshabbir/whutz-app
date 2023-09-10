import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-100 dark:bg-slate-800",
        className
      )}
      {...props}
    />
  )
}

function AvatarSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn(
        `mb-2 max-h-[3rem] min-h-[2rem] min-w-[2rem] max-w-[3rem] max-w-[3rem] rounded-full bg-gray-300 p-4`,
        className
      )}
    />
  )
}

function MessageSkeleton({ from }: { from: "USER" | "FRIEND" }) {
  return (
    <div
      className={`flex ${
        from === "USER" ? "justify-end" : "justify-start"
      } items-center`}
    >
      <AvatarSkeleton className={`mb-0 ${from === "FRIEND" ? "ml-4" : ""}`} />
      <Skeleton
        className={`mx-4 my-4 flex h-12 w-[80%] justify-end rounded-md bg-gray-300 p-4`}
      />
    </div>
  )
}

function ChatHistorySkeleton() {
  const NUM_MESSAGES = 10

  const Messages = new Array(NUM_MESSAGES)
    .fill(0)
    .map((_, idx) => (
      <MessageSkeleton key={idx} from={idx % 2 == 1 ? "FRIEND" : "USER"} />
    ))

  return Messages
}

export { Skeleton, AvatarSkeleton, MessageSkeleton, ChatHistorySkeleton }
