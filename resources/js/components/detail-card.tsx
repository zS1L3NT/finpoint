import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function DetailCard({
	label,
	value,
	className,
	valueClassName,
}: {
	label: string
	value: ReactNode
	className?: string
	valueClassName?: string
}) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardDescription className="text-[10px] font-medium uppercase tracking-wide">
					{label}
				</CardDescription>
			</CardHeader>
			<CardContent className={cn("text-sm font-medium", valueClassName)}>{value}</CardContent>
		</Card>
	)
}
