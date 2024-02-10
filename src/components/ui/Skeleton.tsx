import { Spinner } from "./Spinner"
import { cn } from "@/lib/utils"

export function Skeleton({
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
    ></div>
  )
}

export function AvatarSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn(
        `max-h-[3rem] min-h-[2.5rem] min-w-[2.5rem] max-w-[3rem] rounded-full bg-gray-300 sm:h-[3rem] sm:w-[3rem]`,
        className
      )}
    />
  )
}

export function ChatHistorySkeleton() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div>Loading chat...</div>
      <Spinner />
    </div>
  )
}
