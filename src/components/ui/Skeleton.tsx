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

function AvatarSkeleton() {
  return <Skeleton className="mb-2 h-12 w-12 rounded-full bg-gray-300 p-4" />
}

export { Skeleton, AvatarSkeleton }
