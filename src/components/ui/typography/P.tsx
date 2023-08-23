import { cn } from "@/lib/utils"
import React from "react"

const P = ({
  className,
  children,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div>
      <p
        className={cn(
          "font-Montserrat leading-7 [&:not(:first-child)]:mt-6",
          className
        )}
      >
        {children}
      </p>
    </div>
  )
}

export { P }
