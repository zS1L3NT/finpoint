"use client"
import { useLiveQuery } from "dexie-react-hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { getDrilldown, type Selection } from "@/logic/drilldown"

export default function LargestRecords({
	month,
	year,
	scope,
	onDrill,
}: {
	month: string
	year: number
	scope: string
	onDrill: (selection: Selection) => void
}) {
	const data = useLiveQuery(
		() => getDrilldown(month, year, scope, { kind: "largest", value: "" }),
		[month, year, scope],
	)
	if (!data) return null
	return (
		<Card className="min-w-0">
			<CardHeader>
				<CardTitle>Largest Records</CardTitle>
				<CardDescription>
					Top five Spending Records by absolute amount · current scope, refunds included.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-2">
				{data.records.slice(0, 5).map(r => (
					<button
						type="button"
						key={r.id}
						onClick={() => onDrill({ kind: "largest", value: "" })}
						className="flex items-center justify-between gap-3 rounded p-2 text-left text-sm hover:bg-muted active:bg-muted"
					>
						<span className="min-w-0 truncate">{r.title}</span>
						<span className="shrink-0 tabular-nums">
							{r.amount > 0 ? "Refund " : ""}
							{formatCurrency(Math.abs(r.amount))} ›
						</span>
					</button>
				))}
				{!data.records.length ? (
					<p className="text-sm text-muted-foreground">No Spending Records this month.</p>
				) : null}
				<Button variant="ghost" onClick={() => onDrill({ kind: "largest", value: "" })}>
					See all
				</Button>
			</CardContent>
		</Card>
	)
}
