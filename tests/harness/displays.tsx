import { MotionConfig } from "framer-motion"
import { useState } from "react"
import { createRoot } from "react-dom/client"
import "@/app.css"
import AllocateBar from "@/components/allocate-bar"
import Sparkline from "@/components/charts/sparkline"
import { DetailSummary, DetailSummaryItem } from "@/components/detail-summary"
import Icon, { UiIcon } from "@/components/icon"
import MonthlyBudgetBadge from "@/components/monthly-budget-badge"
import RecordAmount from "@/components/record-amount"
import { Button } from "@/components/ui/button"
import ValueSwap from "@/components/value-swap"
import type { Record } from "@/types"

const record: Record = {
	id: "display-record",
	datetime: "2026-10-01T10:00",
	title: "Display Record",
	subtitle: null,
	people: null,
	location: null,
	description: null,
	amount: -25,
	allocated_amount: -10,
	is_pending: true,
	analytics_treatment: "spending",
	analytics_treatment_source: "category",
	revision: 1,
	monthly_budget_id: null,
	monthly_budget_source: null,
	category: {
		id: "display-category",
		name: "Groceries",
		icon: "apple",
		color: "#EF6C00",
		parent_category_id: null,
		can_delete: false,
		records_count: 1,
		analytics_treatment: "spending",
		default_monthly_budget_id: null,
	},
}

function Displays() {
	const [value, setValue] = useState("$0.00")
	const [showTrend, setShowTrend] = useState(false)
	const [dark, setDark] = useState(matchMedia("(prefers-color-scheme: dark)").matches)
	const long = "Archived breakfast café 早餐 ".repeat(8).trim()
	return (
		<MotionConfig reducedMotion="user">
			<main
				className={
					dark
						? "dark bg-background text-foreground min-h-screen p-4 space-y-6"
						: "bg-background text-foreground min-h-screen p-4 space-y-6"
				}
			>
				<h1>Display components</h1>
				<Button onClick={() => setDark(!dark)}>Toggle theme</Button>
				<section aria-label="Allocation boundaries" className="space-y-3">
					{[
						["Zero", 0, 0],
						["Partial negative", -10, -25],
						["Full", 25, 25],
						["Excess", -75, -50],
						["Opposite sign", 10, -25],
					].map(([title, value, total]) => (
						<div key={title} data-testid={`allocation-${title}`}>
							<AllocateBar
								title={String(title)}
								value={Number(value)}
								total={Number(total)}
							/>
						</div>
					))}
				</section>
				<section aria-label="Sparkline boundaries" className="flex flex-wrap gap-4">
					{[
						["Empty", []],
						["Single", [4]],
						["Zero", [0, 0, 0]],
						["Negative", [-5, -10, -2]],
						["Mixed", [-10, 0, 10]],
						["Dense", Array.from({ length: 100 }, (_, i) => ((i % 7) - 3) * 100)],
					].map(([name, values]) => (
						<div key={String(name)} data-testid={`sparkline-${name}`}>
							<Sparkline label={String(name)} values={values as number[]} />
						</div>
					))}
				</section>
				<section aria-label="Record amounts" className="space-x-3">
					<span data-testid="pending-amount">
						<RecordAmount record={record} />
					</span>
					<span data-testid="confirmed-amount">
						<RecordAmount record={{ ...record, is_pending: false, amount: 20 }} />
					</span>
					<span data-testid="zero-amount">
						<RecordAmount record={record} amount={0} showAccumulated={false} />
					</span>
				</section>
				<section aria-label="Trend entrance">
					<Button onClick={() => setShowTrend(true)}>Show trend</Button>
					{showTrend ? <Sparkline values={[-10, 0, 10]} label="New trend" /> : null}
				</section>
				<section aria-label="Budget badges" className="flex flex-col items-start gap-2">
					<MonthlyBudgetBadge name="Unbudgeted" color={null} />
					<MonthlyBudgetBadge name="No colour" color={undefined} />
					<MonthlyBudgetBadge
						name={<span className="truncate">{long}</span>}
						color="#38bdf8"
						title={long}
						className="max-w-full"
					/>
				</section>
				<section aria-label="Icon boundaries" className="flex gap-3">
					<UiIcon icon="lucide:arrow-left" aria-label="Known icon" />
					<UiIcon icon="  lucide:apple  " aria-label="Dynamic icon" />
					<UiIcon icon="no-such-lucide-icon" aria-label="Fallback icon" />
					<span data-testid="empty-icon">
						<UiIcon icon=" " />
					</span>
					<span data-testid="colour-icon">
						<Icon icon={null} color="#EF6C00" size={16} />
					</span>
				</section>
				<section aria-label="Detail summary">
					<DetailSummary columns={4} footer="Missing optional values remain readable">
						<DetailSummaryItem icon="lucide:wallet" label="Zero" value={0} />
						<DetailSummaryItem
							icon="lucide:wallet"
							label="Negative"
							value="-$25.00"
							detail="Allocated -$10.00"
						/>
						<DetailSummaryItem icon="lucide:wallet" label="Empty" value="—" />
						<DetailSummaryItem
							icon="lucide:wallet"
							label="Long label"
							value={<span className="break-words">{long}</span>}
						/>
					</DetailSummary>
				</section>
				<section aria-label="Changing value">
					<ValueSwap value={value}>
						<span data-value={value}>{value}</span>
					</ValueSwap>
					<Button onClick={() => setValue(value === "$0.00" ? "-$25.00" : "$0.00")}>
						Change value
					</Button>
				</section>
			</main>
		</MotionConfig>
	)
}

const root = document.getElementById("root")
if (!root) throw new Error("Display harness root missing")
createRoot(root).render(<Displays />)
