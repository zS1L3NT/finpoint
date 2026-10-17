"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import RecordCreatorDialog from "@/components/dialogs/record-creator"
import SelectField from "@/components/form/select-field"
import TextField from "@/components/form/text-field"
import { UiIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { TREATMENTS } from "@/lib/analytics"
import { cardEnter } from "@/lib/motion"
import { formatCurrency, formatDatetime, pluralize } from "@/lib/utils"
import { listAccounts } from "@/logic/accounts"
import { listCategories } from "@/logic/categories"
import { listMonthlyBudgets } from "@/logic/monthly-budgets"
import { parsePage } from "@/logic/pagination"
import {
	CONDITION_FIELDS,
	conditionOperators,
	deleteStatementRule,
	listStatementRules,
	previewStatementRule,
	RULE_FIELDS,
	type RuleInput,
	runStatementRule,
	saveStatementRule,
} from "@/logic/statement-rules"
import { ValidationError } from "@/logic/validate"
import { pathStatementRules } from "@/routes"
import type { Statement } from "@/types"
import type {
	RuleActions,
	RuleCondition,
	RuleDataset,
	StatementRule,
} from "@/types/statement-rules"

export default function StatementRulesPage() {
	const router = useRouter()
	const params = useSearchParams()
	const selected = params.get("rule") ?? "new"
	const rules = useLiveQuery(() => listStatementRules(), [])
	const accounts = useLiveQuery(() => listAccounts(), [])
	const categories = useLiveQuery(() => listCategories(), [])
	const budgets = useLiveQuery(() => listMonthlyBudgets(), [])
	const rule = rules?.find(r => r.id === selected)

	return (
		<PageContent>
			<PageHeader
				title="Statement rules"
				subtitle="Search statements with your own conditions, then suggest or autofill record fields."
				description="Your shortcuts"
				icon="lucide:list-filter"
				actions={
					<Button onClick={() => router.push(pathStatementRules())}>
						<UiIcon icon="lucide:plus" />
						New rule
					</Button>
				}
			/>
			{rules === undefined ||
			accounts === undefined ||
			categories === undefined ||
			budgets === undefined ? null : (
				<div className="grid items-start gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
					<aside className="grid gap-2" aria-label="Saved rules">
						<p className="text-sm font-semibold">
							Saved rules{" "}
							<span className="text-muted-foreground tabular-nums">
								{rules.length}
							</span>
						</p>
						{rules.length === 0 ? (
							<p className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
								Create your first rule. No bank-specific formats required.
							</p>
						) : (
							rules.map(r => (
								<button
									key={r.id}
									type="button"
									aria-pressed={selected === r.id}
									className="rounded-xl border p-4 text-left transition-colors duration-150 ease-out hover:bg-muted aria-pressed:bg-muted"
									onClick={() => router.push(pathStatementRules({ rule: r.id }))}
								>
									<span className="block font-medium">{r.name}</span>
									<span className="text-xs text-muted-foreground">
										{r.enabled ? "Enabled" : "Disabled"} · Priority {r.priority}
									</span>
								</button>
							))
						)}
						<p className="text-xs text-muted-foreground">
							Lower priority numbers autofill first. All suggestions remain available.
						</p>
					</aside>
					{selected !== "new" && !rule ? (
						<p>This rule no longer exists.</p>
					) : (
						<RuleEditor
							key={rule ? `${rule.id}:${rule.updated_at}` : "new"}
							rule={rule}
							accounts={accounts}
							categories={categories}
							budgets={budgets}
						/>
					)}
				</div>
			)}
		</PageContent>
	)
}

const OPERATOR_LABELS = {
	contains: "Contains",
	not_contains: "Does not contain",
	equals: "Equals",
	starts_with: "Starts with",
	gte: "At least / on or after",
	lte: "At most / on or before",
}

function RuleEditor({
	rule,
	accounts,
	categories,
	budgets,
}: {
	rule?: StatementRule
	accounts: Awaited<ReturnType<typeof listAccounts>>
	categories: Awaited<ReturnType<typeof listCategories>>
	budgets: Awaited<ReturnType<typeof listMonthlyBudgets>>
}) {
	const router = useRouter()
	const params = useSearchParams()
	const [name, setName] = useState(rule?.name ?? "")
	const [enabled, setEnabled] = useState(rule?.enabled ?? true)
	const [priority, setPriority] = useState(String(rule?.priority ?? 100))
	const [accountIds, setAccountIds] = useState(rule?.account_ids ?? [])
	const [mode, setMode] = useState<"all" | "any">(rule?.conditions.mode ?? "all")
	const [conditions, setConditions] = useState(() =>
		(
			rule?.conditions.items ?? [
				{ field: "description", operator: "contains", value: "" } as RuleCondition,
			]
		).map(condition => ({ key: crypto.randomUUID(), condition })),
	)
	const [actions, setActions] = useState<RuleActions>(rule?.actions ?? {})
	const [busy, setBusy] = useState(false)
	const [selection, setSelection] = useState<Statement[]>([])
	const [creating, setCreating] = useState(false)
	const { apiErrors, setApiErrors, getApiFieldErrors, resetApiErrors } = useApiFormErrors()
	const dataset: RuleDataset =
		params.get("dataset") === "new"
			? "new"
			: params.get("dataset") === "existing"
				? "existing"
				: "both"
	const query = params.get("query") ?? ""
	const setParams = (values: Record<string, string>) => {
		const next = new URLSearchParams(params)
		for (const [key, value] of Object.entries(values))
			value ? next.set(key, value) : next.delete(key)
		router.replace(pathStatementRules(Object.fromEntries(next)), { scroll: false })
	}
	const input: RuleInput = {
		name,
		enabled,
		priority: Number(priority),
		account_ids: accountIds,
		conditions: { mode, items: conditions.map(c => c.condition) },
		actions,
	}
	const dirty =
		!rule ||
		JSON.stringify(input) !==
			JSON.stringify({
				name: rule.name,
				enabled: rule.enabled,
				priority: rule.priority,
				account_ids: rule.account_ids,
				conditions: rule.conditions,
				actions: rule.actions,
			})
	const preview = useLiveQuery(
		() => previewStatementRule(input, rule?.id, dataset, query),
		[JSON.stringify(input), rule?.id, dataset, query],
	)
	const page = Math.min(
		parsePage(params.get("page")),
		Math.max(1, Math.ceil((preview?.length ?? 0) / 10)),
	)
	const visible = preview?.slice((page - 1) * 10, page * 10)
	const flatCategories = categories.flatMap(c => [c, ...c.children])
	const changeCondition = (key: string, patch: Partial<RuleCondition>) =>
		setConditions(rows =>
			rows.map(row =>
				row.key === key ? { ...row, condition: { ...row.condition, ...patch } } : row,
			),
		)

	const perform = async (action: () => Promise<void>) => {
		setBusy(true)
		resetApiErrors()
		try {
			await action()
		} catch (cause) {
			if (cause instanceof ValidationError) setApiErrors(cause.errors)
			else toast.error("Unable to update statement rules.")
		} finally {
			setBusy(false)
		}
	}

	return (
		<motion.div {...cardEnter(0)} className="grid min-w-0 gap-6">
			<form
				className="grid gap-6 rounded-xl border p-4 md:p-6"
				onSubmit={event => {
					event.preventDefault()
					void perform(async () => {
						const saved = await saveStatementRule(input, rule?.id)
						router.replace(pathStatementRules({ rule: saved.id, dataset }))
						toast.success("Rule saved. Preview and run it to use its recommendations.")
					})
				}}
			>
				<div>
					<h2 className="text-lg font-semibold tracking-tight">
						{rule ? "Edit rule" : "Create a rule"}
					</h2>
					<p className="text-sm text-muted-foreground">
						Choose what to look for and what the record creator should offer.
					</p>
				</div>
				<div className="grid gap-4 sm:grid-cols-[1fr_120px]">
					<TextField
						id="rule-name"
						label="Rule name"
						placeholder="e.g. Coffee near work"
						value={name}
						errors={getApiFieldErrors("name")}
						onChange={setName}
					/>
					<label className="grid gap-2 text-sm font-medium" htmlFor="rule-priority">
						Priority
						<Input
							id="rule-priority"
							type="number"
							min="0"
							step="1"
							value={priority}
							onChange={e => setPriority(e.target.value)}
						/>
					</label>
				</div>
				<label className="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						checked={enabled}
						onChange={e => setEnabled(e.target.checked)}
					/>
					Enable rule
				</label>
				<fieldset className="grid gap-2">
					<legend className="mb-2 text-sm font-medium">Accounts</legend>
					<p className="text-xs text-muted-foreground">
						Leave unchecked to include all accounts.
					</p>
					<div className="flex flex-wrap gap-3">
						{accounts.map(a => (
							<label key={a.id} className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={accountIds.includes(a.id)}
									onChange={e =>
										setAccountIds(
											e.target.checked
												? [...accountIds, a.id]
												: accountIds.filter(id => id !== a.id),
										)
									}
								/>
								{a.name}
							</label>
						))}
					</div>
				</fieldset>
				<div className="grid gap-3 border-t pt-5">
					<SelectField
						id="condition-mode"
						label="Conditions"
						value={mode}
						items={[
							{ value: "all", label: "Match all conditions" },
							{ value: "any", label: "Match any condition" },
						]}
						onChange={value => setMode(value as "all" | "any")}
					/>
					{conditions.map(({ key, condition }, i) => (
						<div
							key={key}
							className="grid items-end gap-3 rounded-lg bg-muted/40 p-3 sm:grid-cols-[1fr_1.2fr_1fr_auto]"
						>
							<SelectField
								id={`field-${key}`}
								label="Field"
								value={condition.field}
								items={CONDITION_FIELDS}
								onChange={value => {
									const field = value as RuleCondition["field"]
									changeCondition(key, {
										field,
										operator: conditionOperators(field)[0],
										value: "",
									})
								}}
							/>
							<SelectField
								id={`operator-${key}`}
								label="Condition"
								value={condition.operator}
								items={conditionOperators(condition.field).map(value => ({
									value,
									label: OPERATOR_LABELS[value],
								}))}
								onChange={value =>
									changeCondition(key, {
										operator: value as RuleCondition["operator"],
									})
								}
							/>
							{condition.field === "is_pending" ? (
								<SelectField
									id={`value-${key}`}
									label="Value"
									value={condition.value}
									items={[
										{ value: "true", label: "Pending" },
										{ value: "false", label: "Confirmed" },
									]}
									onChange={value => changeCondition(key, { value })}
								/>
							) : (
								<label
									className="grid gap-2 text-sm font-medium"
									htmlFor={`value-${key}`}
								>
									Value
									<Input
										id={`value-${key}`}
										type={
											condition.field === "amount"
												? "number"
												: condition.field === "date"
													? "date"
													: "text"
										}
										step={condition.field === "amount" ? "0.01" : undefined}
										placeholder={
											condition.field === "description"
												? "Text to find"
												: undefined
										}
										value={condition.value}
										onChange={e =>
											changeCondition(key, { value: e.target.value })
										}
									/>
									<FieldError
										errors={getApiFieldErrors(`conditions.items.${i}.value`)}
									/>
								</label>
							)}
							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label="Remove condition"
								disabled={conditions.length === 1}
								onClick={() =>
									setConditions(rows => rows.filter(row => row.key !== key))
								}
							>
								<UiIcon icon="lucide:x" />
							</Button>
						</div>
					))}
					<Button
						type="button"
						variant="outline"
						className="w-fit"
						onClick={() =>
							setConditions(rows => [
								...rows,
								{
									key: crypto.randomUUID(),
									condition: {
										field: "description",
										operator: "contains",
										value: "",
									},
								},
							])
						}
					>
						<UiIcon icon="lucide:plus" />
						Add condition
					</Button>
					<p className="text-xs text-muted-foreground">
						Text comparisons ignore case. Amounts are signed: spending is usually
						negative.
					</p>
				</div>
				<div className="grid gap-4 border-t pt-5">
					<div>
						<h3 className="text-sm font-semibold">Record fields</h3>
						<p className="text-xs text-muted-foreground">
							Suggest adds a clickable badge below the field. Autofill fills untouched
							fields when the creator opens.
						</p>
					</div>
					{RULE_FIELDS.map(({ value: field, label }) => {
						const action = actions[field]
						const update = (value: string | null) =>
							setActions(current => ({
								...current,
								[field]: { mode: action?.mode ?? "suggest", value },
							}))
						const options =
							field === "category_id"
								? flatCategories.map(c => ({ value: c.id, label: c.name }))
								: field === "analytics_treatment"
									? TREATMENTS
									: [
											{ value: "unbudgeted", label: "Unbudgeted" },
											...budgets
												.filter(b => !b.archived)
												.map(b => ({ value: b.id, label: b.name })),
										]
						return (
							<div key={field} className="grid items-start gap-3 sm:grid-cols-2">
								<SelectField
									id={`action-${field}`}
									label={label}
									value={action?.mode ?? "off"}
									items={[
										{ value: "off", label: "Leave unchanged" },
										{ value: "suggest", label: "Suggest" },
										{ value: "autofill", label: "Autofill" },
									]}
									onChange={value =>
										setActions(current => {
											const next = { ...current }
											if (value === "off") delete next[field]
											else
												Object.assign(next, {
													[field]: {
														mode: value,
														value:
															action?.value ??
															(field === "monthly_budget_id"
																? null
																: ""),
													},
												})
											return next
										})
									}
								/>
								{action ? (
									field === "title" || field === "location" ? (
										<TextField
											id={`action-value-${field}`}
											label="Value"
											value={action.value ?? ""}
											errors={getApiFieldErrors(`actions.${field}.value`)}
											onChange={update}
										/>
									) : (
										<SelectField
											id={`action-value-${field}`}
											label="Value"
											value={
												action.value === null ? "unbudgeted" : action.value
											}
											placeholder="Select a value"
											errors={getApiFieldErrors(`actions.${field}.value`)}
											items={options}
											onChange={value =>
												update(
													field === "monthly_budget_id" &&
														value === "unbudgeted"
														? null
														: value,
												)
											}
										/>
									)
								) : null}
							</div>
						)
					})}
				</div>
				<FieldError
					errors={Object.values(apiErrors)
						.flat()
						.map(message => ({ message }))}
				/>
				<div className="flex flex-wrap gap-2">
					<Button type="submit" disabled={busy}>
						Save rule
					</Button>
					{rule ? (
						<Button
							type="button"
							variant="destructive"
							disabled={busy}
							onClick={() => {
								if (window.confirm(`Delete “${rule.name}”?`))
									void perform(async () => {
										await deleteStatementRule(rule.id)
										router.replace(pathStatementRules())
										toast.success("Rule deleted.")
									})
							}}
						>
							Delete rule
						</Button>
					) : null}
				</div>
			</form>
			<div className="grid gap-4 rounded-xl border p-4 md:p-6">
				<div>
					<h2 className="text-lg font-semibold tracking-tight">
						Preview matching statements
					</h2>
					<p className="text-sm text-muted-foreground">
						Run the saved rule to make its actions available in the record creator.
						Saved records are not changed.
					</p>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					<SelectField
						id="run-dataset"
						label="Run on"
						value={dataset}
						items={[
							{ value: "existing", label: "Existing statements" },
							{ value: "new", label: "New statements" },
							{ value: "both", label: "Both" },
						]}
						onChange={value => {
							setSelection([])
							setParams({ dataset: value, page: "" })
						}}
					/>
					<TextField
						id="preview-search"
						label="Search within matches"
						type="search"
						value={query}
						placeholder="Search descriptions…"
						onChange={value => setParams({ query: value, page: "" })}
					/>
				</div>
				<p className="text-xs text-muted-foreground">
					New means added since this rule was created or last run on them. Existing means
					already known at that point. Search narrows this preview only.
				</p>
				<div className="flex flex-wrap items-center gap-3">
					<Button
						type="button"
						disabled={busy || dirty || !enabled || preview === undefined}
						onClick={() =>
							void perform(async () => {
								if (!rule) return
								const result = await runStatementRule(rule.id, dataset)
								toast.success(
									`Rule run: ${result.matched} ${result.matched === 1 ? "match" : "matches"} across ${pluralize(result.scanned, "statement")}.`,
								)
							})
						}
					>
						<UiIcon icon="lucide:play" />
						Run saved rule
					</Button>
					{dirty ? (
						<span className="text-xs text-muted-foreground">
							Save changes before running.
						</span>
					) : null}
					<Button
						type="button"
						variant="outline"
						disabled={!selection.length || dirty}
						onClick={() => setCreating(true)}
					>
						Create record from selection
					</Button>
				</div>
				{preview === undefined ? null : (
					<>
						<p className="text-sm text-muted-foreground tabular-nums">
							{pluralize(preview.length, "matching statement")} · {selection.length}{" "}
							selected
						</p>
						<div className="divide-y">
							{visible?.map(s => (
								<label
									key={s.id}
									className="flex cursor-pointer items-start gap-3 py-3"
								>
									<input
										className="mt-1"
										type="checkbox"
										disabled={s.allocable_amount === 0}
										checked={selection.some(row => row.id === s.id)}
										onChange={e =>
											setSelection(rows =>
												e.target.checked
													? [...rows, s]
													: rows.filter(row => row.id !== s.id),
											)
										}
									/>
									<span className="min-w-0 flex-1">
										<span className="block wrap-break-word text-sm">
											{s.description || "(Empty description)"}
										</span>
										<span className="text-xs text-muted-foreground">
											{s.account.name} · {formatDatetime(s.datetime)}
											{s.is_pending ? " · Pending" : ""}
										</span>
									</span>
									<span className="shrink-0 text-sm tabular-nums">
										{formatCurrency(s.amount)}
									</span>
								</label>
							))}
							{preview.length === 0 ? (
								<p className="py-5 text-sm text-muted-foreground">
									No statements meet these conditions in this dataset.
								</p>
							) : null}
						</div>
						<div className="flex items-center justify-between">
							<Button
								type="button"
								variant="outline"
								disabled={page <= 1}
								onClick={() => setParams({ page: String(page - 1) })}
							>
								Previous
							</Button>
							<span className="text-xs text-muted-foreground tabular-nums">
								Page {page} of {Math.max(1, Math.ceil(preview.length / 10))}
							</span>
							<Button
								type="button"
								variant="outline"
								disabled={page * 10 >= preview.length}
								onClick={() => setParams({ page: String(page + 1) })}
							>
								Next
							</Button>
						</div>
					</>
				)}
			</div>
			<RecordCreatorDialog
				statements={selection}
				categories={categories}
				clear={() => setSelection([])}
				isOpen={creating}
				setIsOpen={setCreating}
			/>
		</motion.div>
	)
}
