import { cn } from "@/lib/utils"
import { Spinner } from "./Spinner"

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
        `max-h-[3rem] min-h-[2.5rem] min-w-[2.5rem] max-w-[3rem] rounded-full bg-gray-300 sm:h-[3rem] sm:w-[3rem]`,
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
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full w-full">
      <div>fetching your messages...</div>
      <Spinner />
    </div>
  ) 
}

export { Skeleton, AvatarSkeleton, MessageSkeleton, ChatHistorySkeleton }
