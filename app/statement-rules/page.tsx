"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { motion } from "framer-motion"
import { useState } from "react"
import StatementRuleDialog from "@/components/dialogs/statement-rule"
import { ruleValueLabel } from "@/components/form/rule-suggestions"
import { UiIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cardEnter } from "@/lib/motion"
import { cn, pluralize } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { listMonthlyBudgets } from "@/logic/monthly-budgets"
import {
	listStatementRules,
	RULE_FIELDS,
	RULE_OPERATORS,
	setStatementRuleEnabled,
} from "@/logic/statement-rules"
import type { CategoryWithChildren } from "@/types"

type Rule = Awaited<ReturnType<typeof listStatementRules>>[number]

export default function StatementRulesPage() {
	const [dialogRule, setDialogRule] = useState<Rule | "new" | null>(null)

	const rules = useLiveQuery(() => listStatementRules(), [])
	const categories = useLiveQuery(() => listCategories(), []) ?? []
	const monthlyBudgets = useLiveQuery(() => listMonthlyBudgets(), []) ?? []

	return (
		<>
			<PageContent>
				<PageHeader
					title="Statement rules"
					subtitle="Recognise recurring Statements by their description and prepare the Records you create from them."
					description="Record shortcuts"
					icon="lucide:wand-sparkles"
					actions={
						<Button className="w-full sm:w-auto" onClick={() => setDialogRule("new")}>
							<UiIcon icon="lucide:plus" /> New rule
						</Button>
					}
				/>

				{rules === undefined ? null : rules.length === 0 ? (
					<motion.div
						{...cardEnter(0)}
						className="grid justify-items-center gap-3 rounded-xl border border-dashed p-10 text-center"
					>
						<UiIcon
							icon="lucide:wand-sparkles"
							className="size-5 text-muted-foreground"
						/>
						<div className="grid gap-1">
							<p className="text-sm font-medium">No rules yet</p>
							<p className="max-w-sm text-xs text-muted-foreground">
								For example, when the description contains{" "}
								<span className="font-mono">SPOTIFY</span>, suggest the title
								“Spotify” and autofill the Subscriptions category.
							</p>
						</div>
						<Button variant="outline" size="sm" onClick={() => setDialogRule("new")}>
							Create a rule
						</Button>
					</motion.div>
				) : (
					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
						{rules.map((rule, index) => (
							<motion.div
								key={rule.id}
								className="grid min-w-0 grid-cols-1"
								{...cardEnter(index)}
							>
								<RuleCard
									rule={rule}
									categories={categories}
									monthlyBudgets={monthlyBudgets}
									onEdit={() => setDialogRule(rule)}
								/>
							</motion.div>
						))}
					</div>
				)}
			</PageContent>

			<StatementRuleDialog
				rule={dialogRule === "new" ? null : dialogRule}
				categories={categories}
				monthlyBudgets={monthlyBudgets}
				isOpen={dialogRule !== null}
				setIsOpen={open => {
					if (!open) setDialogRule(null)
				}}
			/>
		</>
	)
}

function RuleCard({
	rule,
	categories,
	monthlyBudgets,
	onEdit,
}: {
	rule: Rule
	categories: CategoryWithChildren[]
	monthlyBudgets: Awaited<ReturnType<typeof listMonthlyBudgets>>
	onEdit: () => void
}) {
	return (
		<article
			className={cn(
				"group grid min-w-0 grid-cols-1 content-start gap-3 rounded-xl border bg-card p-4 transition-shadow duration-150 ease-out hover:shadow-md",
				!rule.enabled && "bg-muted/30",
			)}
		>
			<header className="flex items-start gap-3">
				<button
					type="button"
					className="min-w-0 flex-1 cursor-pointer text-left"
					aria-label={`Edit ${rule.name}`}
					onClick={onEdit}
				>
					<span
						className={cn(
							"block truncate font-medium",
							!rule.enabled && "text-muted-foreground",
						)}
					>
						{rule.name}
					</span>
					<span className="block text-xs text-muted-foreground tabular-nums">
						{rule.enabled
							? pluralize(
									rule.matches,
									rule.include_existing
										? "matching Statement"
										: "new matching Statement",
								)
							: "Paused"}
					</span>
				</button>
				<Button
					variant="ghost"
					size="icon-sm"
					title={rule.enabled ? "Pause" : "Resume"}
					aria-label={`${rule.enabled ? "Pause" : "Resume"} ${rule.name}`}
					className="opacity-60 group-hover:opacity-100"
					onClick={() => setStatementRuleEnabled(rule.id, !rule.enabled)}
				>
					<UiIcon icon={rule.enabled ? "lucide:pause" : "lucide:play"} />
				</Button>
			</header>

			<p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
				Description
				{rule.conditions.items.map((c, i) => (
					<span key={`${i}:${c.value}`} className="contents">
						{i > 0 ? (
							<span>{rule.conditions.mode === "all" ? "and" : "or"}</span>
						) : null}
						<span>{RULE_OPERATORS.find(o => o.value === c.operator)?.label}</span>
						<span className="max-w-full truncate rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
							{c.value}
						</span>
					</span>
				))}
			</p>

			<dl className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 border-t pt-3 text-xs">
				{RULE_FIELDS.filter(f => rule.actions[f.value]).map(({ value: field, label }) => (
					<div key={field} className="contents">
						<dt className="text-muted-foreground">{label}</dt>
						<dd className="truncate">
							{ruleValueLabel(
								field,
								rule.actions[field]?.value ?? null,
								categories,
								monthlyBudgets,
							)}
						</dd>
						<dd>
							<Badge
								variant={
									rule.actions[field]?.mode === "autofill"
										? "secondary"
										: "outline"
								}
							>
								{rule.actions[field]?.mode === "autofill" ? "Autofill" : "Suggest"}
							</Badge>
						</dd>
					</div>
				))}
			</dl>
		</article>
	)
}
