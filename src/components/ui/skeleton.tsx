import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md motion-reduce:animate-none bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
