import { Progress } from "@/components/ui/progress"
import { cn, currencyClass, toCurrency } from "@/lib/utils"

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
					<span className={cn("text-muted-foreground", currencyClass(value))}>
						{toCurrency(value)}
					</span>
					{" / "}
					<span className={cn("font-bold", currencyClass(total))}>
						{toCurrency(total)}
					</span>
				</div>
			</div>
			<Progress value={total === 0 ? 0 : (value / total) * 100} />
		</div>
	)
}
