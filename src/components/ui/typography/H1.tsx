import { cn } from "@/lib/utils"

export function H1({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h1
      className={cn(
        "scroll-m-20 font-Montserrat text-4xl font-medium tracking-tight lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  )
}
