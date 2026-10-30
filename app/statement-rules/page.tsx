"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { motion } from "framer-motion"
import { useState } from "react"
import StatementRuleDialog from "@/components/dialogs/statement-rule"
import { ruleValueLabel } from "@/components/form/rule-suggestions"
import { UiIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { cardEnter } from "@/lib/motion"
import { cn, pluralize } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { listMonthlyBudgets } from "@/logic/monthly-budgets"
import {
	listStatementRules,
	RULE_FIELDS,
	RULE_OPERATORS,
	type RuleInput,
	setStatementRuleEnabled,
} from "@/logic/statement-rules"
import { type RuleSuggestion, suggestedStatementRules } from "@/logic/suggestions"
import type { CategoryWithChildren } from "@/types"

type Rule = Awaited<ReturnType<typeof listStatementRules>>[number]

export default function StatementRulesPage() {
	const [dialogRule, setDialogRule] = useState<Rule | RuleInput | "new" | null>(null)

	const rules = useLiveQuery(() => listStatementRules(), [])
	const suggestions = useLiveQuery(() => suggestedStatementRules(), []) ?? []
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
								<span className="font-mono">SPOTIFY</span>, fill in the title
								“Spotify” and the Subscriptions category.
							</p>
						</div>
						<Button variant="outline" size="sm" onClick={() => setDialogRule("new")}>
							Create a rule
						</Button>
					</motion.div>
				) : (
					<div className="grid gap-3 @2xl/page:grid-cols-2 @5xl/page:grid-cols-3">
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

				{rules === undefined || !suggestions.length ? null : (
					<section className="grid gap-3" aria-labelledby="suggested-rules">
						<header>
							<h2 id="suggested-rules" className="text-sm font-medium">
								Suggested rules
							</h2>
							<p className="text-xs text-muted-foreground">
								You have made these choices again and again. Review one to fill them
								in for you.
							</p>
						</header>
						<div className="grid gap-3 @2xl/page:grid-cols-2 @5xl/page:grid-cols-3">
							{suggestions.map((suggestion, index) => (
								<motion.div
									key={suggestion.key}
									className="grid min-w-0 grid-cols-1"
									{...cardEnter(index)}
								>
									<SuggestedRuleCard
										suggestion={suggestion}
										categories={categories}
										monthlyBudgets={monthlyBudgets}
										onReview={() =>
											setDialogRule({
												name: suggestion.name,
												enabled: true,
												conditions: suggestion.conditions,
												actions: suggestion.actions,
											})
										}
									/>
								</motion.div>
							))}
						</div>
					</section>
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
						{rule.enabled ? pluralize(rule.matches, "matching Statement") : "Paused"}
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

			<RuleActionList
				actions={rule.actions}
				categories={categories}
				monthlyBudgets={monthlyBudgets}
			/>
		</article>
	)
}

function SuggestedRuleCard({
	suggestion,
	categories,
	monthlyBudgets,
	onReview,
}: {
	suggestion: RuleSuggestion
	categories: CategoryWithChildren[]
	monthlyBudgets: Awaited<ReturnType<typeof listMonthlyBudgets>>
	onReview: () => void
}) {
	return (
		<article className="grid min-w-0 grid-cols-1 content-start gap-3 rounded-xl border border-dashed bg-card p-4">
			<header className="flex items-start gap-3">
				<div className="min-w-0 flex-1">
					<span className="flex items-center gap-1.5 font-medium">
						<UiIcon
							icon="lucide:sparkles"
							className="size-3.5 shrink-0 text-muted-foreground"
						/>
						<span className="truncate">{suggestion.name}</span>
					</span>
					<span className="block text-xs text-muted-foreground tabular-nums">
						{suggestion.agreeing} of{" "}
						{pluralize(suggestion.matches, "matching Statement")} went to{" "}
						{ruleValueLabel(
							"category_id",
							suggestion.actions.category_id?.value ?? null,
							categories,
							monthlyBudgets,
						)}
					</span>
				</div>
				<Button variant="outline" size="sm" onClick={onReview}>
					Review
				</Button>
			</header>

			<p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
				Description contains
				<span className="max-w-full truncate rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
					{suggestion.conditions.items[0]?.value}
				</span>
			</p>

			<RuleActionList
				actions={suggestion.actions}
				categories={categories}
				monthlyBudgets={monthlyBudgets}
			/>
		</article>
	)
}

function RuleActionList({
	actions,
	categories,
	monthlyBudgets,
}: {
	actions: Rule["actions"]
	categories: CategoryWithChildren[]
	monthlyBudgets: Awaited<ReturnType<typeof listMonthlyBudgets>>
}) {
	return (
		<dl className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 border-t pt-3 text-xs">
			{RULE_FIELDS.filter(f => actions[f.value]).map(({ value: field, label }) => (
				<div key={field} className="contents">
					<dt className="text-muted-foreground">{label}</dt>
					<dd className="truncate">
						{ruleValueLabel(
							field,
							actions[field]?.value ?? null,
							categories,
							monthlyBudgets,
						)}
					</dd>
				</div>
			))}
		</dl>
	)
}
