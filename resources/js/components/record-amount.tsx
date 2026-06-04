import { classForCurrency, cn, formatCurrency } from "@/lib/utils"
import type { Record } from "@/types"

export default function RecordAmount({
	record,
	amount = record.amount,
	showAccumulated = record.is_pending,
	className,
}: {
	record: Record
	amount?: number
	showAccumulated?: boolean
	className?: string
}) {
	return (
		<span
			className={cn(
				"inline-flex flex-wrap justify-end gap-x-1 tabular-nums whitespace-nowrap text-right",
				className,
			)}
		>
			<span className={classForCurrency(amount)}>{formatCurrency(amount)}</span>
			{showAccumulated ? (
				<span className="text-muted-foreground">
					[{formatCurrency(record.allocated_amount)}]
				</span>
			) : null}
		</span>
	)
}
