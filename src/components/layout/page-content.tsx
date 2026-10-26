import { cn } from "@/lib/utils"

export default function PageContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"@container/page container mx-auto flex flex-col gap-5 px-4 py-5 md:gap-6 md:p-8",
				className,
			)}
			{...props}
		/>
	)
}
