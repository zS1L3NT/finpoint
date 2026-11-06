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
import { Input } from "@/components/ui/input"
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
import { suggestedStatementRules } from "@/logic/suggestions"
import type { CategoryWithChildren } from "@/types"

type Rule = Awaited<ReturnType<typeof listStatementRules>>[number]

export default function StatementRulesPage() {
	const [dialogRule, setDialogRule] = useState<Rule | RuleInput | "new" | null>(null)

	const [query, setQuery] = useState("")

	const rules = useLiveQuery(() => listStatementRules(), [])
	const suggestions = useLiveQuery(() => suggestedStatementRules(), []) ?? []
	const categories = useLiveQuery(() => listCategories(), []) ?? []
	const monthlyBudgets = useLiveQuery(() => listMonthlyBudgets(), []) ?? []
	const needle = query.trim().toLowerCase()
	const visible = (rules ?? []).filter(
		rule =>
			!needle ||
			[
				rule.name,
				...rule.conditions.items.map(c => c.value),
				...RULE_FIELDS.map(f =>
					rule.actions[f.value]
						? ruleValueLabel(
								f.value,
								rule.actions[f.value]?.value ?? null,
								categories,
								monthlyBudgets,
							)
						: "",
				),
			].some(text => text.toLowerCase().includes(needle)),
	)

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
					<section className="grid gap-2" aria-label="Your rules">
						{rules.length > 5 ? (
							<div className="relative max-w-sm">
								<UiIcon
									icon="lucide:search"
									className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									type="search"
									aria-label="Search rules"
									placeholder="Search rules..."
									className="pl-8"
									value={query}
									onChange={event => setQuery(event.target.value)}
								/>
							</div>
						) : null}
						{visible.length === 0 ? (
							<p className="rounded-xl border border-dashed p-10 text-center text-xs text-muted-foreground">
								No rules match your search.
							</p>
						) : (
							<div className="grid divide-y overflow-hidden rounded-xl border bg-card">
								{visible.map((rule, index) => (
									<motion.article
										key={rule.id}
										{...cardEnter(index)}
										className={cn(
											ROW_CLASS,
											"group transition-colors duration-150 ease-out hover:bg-muted/30",
											!rule.enabled && "bg-muted/30",
										)}
									>
										<button
											type="button"
											className="min-w-0 cursor-pointer text-left"
											aria-label={`Edit ${rule.name}`}
											onClick={() => setDialogRule(rule)}
										>
											<span
												className={cn(
													"block truncate text-sm font-medium",
													!rule.enabled && "text-muted-foreground",
												)}
											>
												{rule.name}
											</span>
											<span className="block text-xs text-muted-foreground tabular-nums">
												{rule.enabled
													? pluralize(rule.matches, "matching Statement")
													: "Paused"}
											</span>
										</button>
										<RuleSentence
											conditions={rule.conditions}
											actions={rule.actions}
											categories={categories}
											monthlyBudgets={monthlyBudgets}
											muted={!rule.enabled}
										/>
										<Button
											variant="ghost"
											size="icon-sm"
											title={rule.enabled ? "Pause" : "Resume"}
											aria-label={`${rule.enabled ? "Pause" : "Resume"} ${rule.name}`}
											className={cn(
												ACTION_CLASS,
												"opacity-60 group-hover:opacity-100",
											)}
											onClick={() =>
												setStatementRuleEnabled(rule.id, !rule.enabled)
											}
										>
											<UiIcon
												icon={rule.enabled ? "lucide:pause" : "lucide:play"}
											/>
										</Button>
									</motion.article>
								))}
							</div>
						)}
					</section>
				)}
				{rules === undefined || !suggestions.length ? null : (
					<section className="grid gap-2" aria-labelledby="suggested-rules">
						<header>
							<h2 id="suggested-rules" className="text-sm font-medium">
								Suggested rules
							</h2>
							<p className="text-xs text-muted-foreground">
								You have made these choices again and again. Review one to fill them
								in for you.
							</p>
						</header>
						<div className="grid divide-y overflow-hidden rounded-xl border border-dashed">
							{suggestions.map((suggestion, index) => (
								<motion.article
									key={suggestion.key}
									{...cardEnter(index)}
									className={ROW_CLASS}
								>
									<div className="min-w-0">
										<span className="flex items-center gap-1.5 text-sm font-medium">
											<UiIcon
												icon="lucide:sparkles"
												className="size-3.5 shrink-0 text-muted-foreground"
											/>
											<span className="truncate">{suggestion.name}</span>
										</span>
										<span className="block text-xs text-muted-foreground tabular-nums">
											{suggestion.agreeing} of{" "}
											{pluralize(suggestion.matches, "matching Statement")}{" "}
											agree
										</span>
									</div>
									<RuleSentence
										conditions={suggestion.conditions}
										actions={suggestion.actions}
										categories={categories}
										monthlyBudgets={monthlyBudgets}
									/>
									<Button
										variant="outline"
										size="sm"
										className={ACTION_CLASS}
										onClick={() =>
											setDialogRule({
												name: suggestion.name,
												enabled: true,
												conditions: suggestion.conditions,
												actions: suggestion.actions,
											})
										}
									>
										Review
									</Button>
								</motion.article>
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

/**
 * One rule per line, read as a sentence: its name, then "Description contains X → Title Y".
 * Narrow pages stack the sentence under the name, with the action beside the name.
 */
const ROW_CLASS =
	"grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 px-4 py-2.5 @3xl/page:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_auto]"
const ACTION_CLASS = "col-start-2 row-start-1 @3xl/page:col-start-3"

function RuleSentence({
	conditions,
	actions,
	categories,
	monthlyBudgets,
	muted,
}: {
	conditions: Rule["conditions"]
	actions: Rule["actions"]
	categories: CategoryWithChildren[]
	monthlyBudgets: Awaited<ReturnType<typeof listMonthlyBudgets>>
	muted?: boolean
}) {
	return (
		<p
			className={cn(
				"col-span-2 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground @3xl/page:col-span-1",
				muted && "opacity-60",
			)}
		>
			Description
			{conditions.items.map((c, i) => (
				<span key={`${i}:${c.value}`} className="contents">
					{i > 0 ? <span>{conditions.mode === "all" ? "and" : "or"}</span> : null}
					<span>{RULE_OPERATORS.find(o => o.value === c.operator)?.label}</span>
					<span className="max-w-full truncate rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
						{c.value}
					</span>
				</span>
			))}
			<UiIcon
				icon="lucide:arrow-right"
				aria-label="fills in"
				className="mx-0.5 size-3 shrink-0"
			/>
			{RULE_FIELDS.filter(f => actions[f.value]).map(({ value: field, label }, i) => (
				<span key={field} className="contents">
					{i > 0 ? <span aria-hidden>·</span> : null}
					<span>{label}</span>
					<span className="max-w-full truncate font-medium text-foreground">
						{ruleValueLabel(
							field,
							actions[field]?.value ?? null,
							categories,
							monthlyBudgets,
						)}
					</span>
				</span>
			))}
		</p>
	)
}
