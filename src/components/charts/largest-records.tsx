"use client"
import { useLiveQuery } from "dexie-react-hooks"
import { useRouter, useSearchParams } from "next/navigation"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import { amountTone } from "@/components/table/record-columns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn, formatCurrency, parseDatetime } from "@/lib/utils"
import { getDrilldown, type Selection } from "@/logic/drilldown"
import { pathDashboard } from "@/routes"

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
	const router = useRouter()
	const params = useSearchParams()
	const data = useLiveQuery(
		() => getDrilldown(month, year, scope, { kind: "largest", value: "" }),
		[month, year, scope],
	)
	if (!data) return null
	return (
		<Card className="min-w-0">
			<CardHeader>
				<div className="flex items-center justify-between gap-2">
					<CardTitle>Largest Records</CardTitle>
					<Button
						variant="link"
						size="sm"
						className="shrink-0"
						onClick={() => onDrill({ kind: "largest", value: "" })}
					>
						See all
					</Button>
				</div>
				<CardDescription title="Current scope, refunds included; ranked by absolute amount.">
					Top five Spending Records by amount
				</CardDescription>
			</CardHeader>
			<CardContent className="grid min-w-0 grid-cols-1 gap-2">
				{data.records.slice(0, 5).map(r => (
					<button
						type="button"
						key={r.id}
						onClick={() =>
							router.push(
								pathDashboard({
									...Object.fromEntries(params),
									drill: "largest",
									focus: `record:${r.id}`,
								}),
								{ scroll: false },
							)
						}
						className="cursor-pointer flex min-w-0 items-center justify-between gap-3 rounded p-2 text-left text-sm hover:bg-muted active:bg-muted"
					>
						<Icon {...r.category} size={14} />
						<span className="min-w-0 flex-1 truncate">
							{r.title}
							<span className="block text-xs text-muted-foreground">
								{parseDatetime(r.datetime).toFormat("ccc d MMM")}
							</span>
						</span>
						<span className={cn("shrink-0 tabular-nums", amountTone(r.amount))}>
							{formatCurrency(r.amount)}{" "}
							<IconifyIcon icon="lucide:chevron-right" className="inline size-4" />
						</span>
					</button>
				))}
				{!data.records.length ? (
					<p className="text-sm text-muted-foreground">No Spending Records this month.</p>
				) : null}
			</CardContent>
		</Card>
	)
}
