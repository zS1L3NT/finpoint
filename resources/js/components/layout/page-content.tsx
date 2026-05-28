import { cn } from "@/lib/utils"

export default function PageContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"container mx-auto flex flex-col gap-6 px-4 py-6 md:gap-8 md:p-8",
				className,
			)}
			{...props}
		/>
	)
}
