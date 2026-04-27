import { Progress } from "@/components/ui/progress"
import { classForCurrency, cn, formatCurrency } from "@/lib/utils"

export default function AllocateBar({
	title,
	value,
	total,
}: {
	title: string
	value: number
	total: number
}) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between">
				<span>{title}</span>
				<div>
					<span className={cn("text-muted-foreground", classForCurrency(value))}>
						{formatCurrency(value)}
					</span>
					{" / "}
					<span className={cn("font-bold", classForCurrency(total))}>
						{formatCurrency(total)}
					</span>
				</div>
			</div>
			<Progress value={total === 0 ? 0 : (value / total) * 100} />
		</div>
	)
}
