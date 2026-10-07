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
	const percent = total === 0 ? 0 : (value / total) * 100
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
			<div
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={Math.round(percent)}
				className="relative h-1 w-full overflow-hidden rounded-md bg-muted"
			>
				<div
					className="h-full origin-left bg-current transition-transform duration-300 ease-out"
					style={{ transform: `scaleX(${Math.min(Math.max(percent, 0), 100) / 100})` }}
				/>
				{percent > 100 ? (
					<div
						className="absolute inset-0 origin-left bg-destructive transition-transform duration-300 ease-out"
						style={{ transform: `scaleX(${Math.min(percent - 100, 100) / 100})` }}
					/>
				) : null}
			</div>
		</div>
	)
}
