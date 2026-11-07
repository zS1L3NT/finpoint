import { formatCurrency } from "@/lib/utils"

export function AllocationProgress({ amount, allocated }: { amount: number; allocated: number }) {
	return (
		<span className="block whitespace-nowrap text-[0.6875rem] text-muted-foreground tabular-nums">
			{formatCurrency(Math.abs(allocated))} of {formatCurrency(Math.abs(amount))} allocated
		</span>
	)
}
