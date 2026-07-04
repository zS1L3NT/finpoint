import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const progress = value ?? 0
  const baseProgress = Math.min(Math.max(progress, 0), 100)
  const excessProgress = Math.min(Math.max(progress - 100, 0), 100)

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-md bg-muted",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-current transition-all"
        style={{ transform: `translateX(-${100 - baseProgress}%)` }}
      />
      {excessProgress > 0 ? (
        <div
          data-slot="progress-excess-indicator"
          className="absolute inset-0 bg-destructive transition-all"
          style={{ transform: `translateX(-${100 - excessProgress}%)` }}
        />
      ) : null}
    </ProgressPrimitive.Root>
  )
}

export { Progress }
