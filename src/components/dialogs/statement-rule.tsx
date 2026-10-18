import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import SelectField from "@/components/form/select-field"
import TextField from "@/components/form/text-field"
import { UiIcon } from "@/components/icon"
import { amountTone } from "@/components/table/record-columns"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { TREATMENTS } from "@/lib/analytics"
import { cn, formatCurrency, formatDatetime, pluralize } from "@/lib/utils"
import type { listMonthlyBudgets } from "@/logic/monthly-budgets"
import {
	deleteStatementRule,
	type listStatementRules,
	previewStatementRule,
	RULE_DATASETS,
	RULE_FIELDS,
	RULE_OPERATORS,
	saveStatementRule,
} from "@/logic/statement-rules"
import { ValidationError } from "@/logic/validate"
import type {
	CategoryWithChildren,
	RuleActions,
	RuleCondition,
	RuleDataset,
	RuleField,
	RuleMode,
} from "@/types"

type Rule = Awaited<ReturnType<typeof listStatementRules>>[number]

const UNSET = "unset"
const UNBUDGETED = "unbudgeted"
const PREVIEW_LIMIT = 50

export default function StatementRuleDialog({
	rule: ruleProp,
	categories,
	monthlyBudgets,
	isOpen,
	setIsOpen,
}: {
	rule: Rule | null
	categories: CategoryWithChildren[]
	monthlyBudgets: Awaited<ReturnType<typeof listMonthlyBudgets>>
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
}) {
	// Keep the last open rule so the title and fields hold still during the exit animation.
	const [snapshot, setSnapshot] = useState(ruleProp)
	if (isOpen && snapshot !== ruleProp) setSnapshot(ruleProp)
	const rule = isOpen ? ruleProp : snapshot

	const [name, setName] = useState("")
	const [mode, setMode] = useState<"all" | "any">("all")
	const [conditions, setConditions] = useState<(RuleCondition & { key: string })[]>([])
	const [actions, setActions] = useState<RuleActions>({})
	const [dataset, setDataset] = useState<RuleDataset>("both")
	const { apiErrors, getApiFieldErrors, clearApiError, resetApiErrors, setApiErrors } =
		useApiFormErrors()

	useEffect(() => {
		if (!isOpen) return
		setName(rule?.name ?? "")
		setMode(rule?.conditions.mode ?? "all")
		setConditions(
			(rule?.conditions.items ?? [{ operator: "contains", value: "" }]).map(c => ({
				...c,
				key: crypto.randomUUID(),
			})),
		)
		setActions(rule?.actions ?? {})
		setDataset(rule?.dataset ?? "both")
		resetApiErrors()
	}, [isOpen, rule, resetApiErrors])

	const input = {
		name,
		enabled: rule?.enabled ?? true,
		conditions: { mode, items: conditions.map(({ operator, value }) => ({ operator, value })) },
		actions,
	}
	const ready = conditions.some(c => c.value.trim())
	const matches = useLiveQuery(
		() => (isOpen && ready ? previewStatementRule(input, rule?.id, dataset) : []),
		[isOpen, JSON.stringify(input.conditions), rule?.id, dataset],
	)
	const needles = conditions
		.filter(c => c.operator !== "not_contains" && c.value.trim())
		.map(c => c.value.trim().toLowerCase())

	const setCondition = (key: string, patch: Partial<RuleCondition>) => {
		setConditions(rows => rows.map(row => (row.key === key ? { ...row, ...patch } : row)))
		clearApiError("conditions")
	}
	const setAction = (field: RuleField, value: string | null | undefined, mode?: RuleMode) => {
		setActions(current => {
			const { [field]: previous, ...rest } = current
			return value === undefined
				? rest
				: { ...rest, [field]: { mode: mode ?? previous?.mode ?? "suggest", value } }
		})
		clearApiError(`actions.${field}.value`)
		clearApiError("actions")
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		try {
			await saveStatementRule(input, dataset, rule?.id)
			setIsOpen(false)
		} catch (cause) {
			if (cause instanceof ValidationError) {
				setApiErrors(cause.errors)
				return
			}
			toast.error("Unable to save this rule.")
		}
	}
	const handleDelete = async () => {
		if (!rule) return
		try {
			await deleteStatementRule(rule.id)
			setIsOpen(false)
		} catch {
			toast.error("Unable to delete this rule.")
		}
	}

	const conditionErrors = Object.entries(apiErrors)
		.filter(([key]) => key.startsWith("conditions"))
		.flatMap(([, messages]) => messages)
	const valueInput = (field: RuleField) => {
		const value = actions[field]?.value
		const select = (items: { value: string; label: string }[]) => (
			<SelectField
				id={`rule-${field}`}
				value={value === undefined ? UNSET : (value ?? UNBUDGETED)}
				items={[{ value: UNSET, label: "Not set" }, ...items]}
				errors={getApiFieldErrors(`actions.${field}.value`)}
				onChange={next =>
					setAction(field, next === UNSET ? undefined : next === UNBUDGETED ? null : next)
				}
			/>
		)
		return field === "category_id" ? (
			select(
				categories.flatMap(c => [
					{ value: c.id, label: c.name },
					...c.children.map(child => ({
						value: child.id,
						label: `${c.name} › ${child.name}`,
					})),
				]),
			)
		) : field === "analytics_treatment" ? (
			select(TREATMENTS)
		) : field === "monthly_budget_id" ? (
			select([
				{ value: UNBUDGETED, label: "Unbudgeted" },
				...monthlyBudgets
					.filter(b => !b.archived)
					.map(b => ({ value: b.id, label: b.name })),
			])
		) : (
			<TextField
				id={`rule-${field}`}
				placeholder="Not set"
				value={value ?? ""}
				errors={getApiFieldErrors(`actions.${field}.value`)}
				onChange={next => setAction(field, next || undefined)}
			/>
		)
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="md:max-w-4xl">
				<DialogHeader>
					<DialogTitle>{rule ? "Edit rule" : "New rule"}</DialogTitle>
					<DialogDescription>
						Recognise a Statement by its description, then prepare the Record you create
						from it.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
					<form id="statement-rule-form" className="grid gap-6" onSubmit={handleSubmit}>
						<TextField
							id="rule-name"
							label="Name"
							placeholder="e.g. Spotify subscription"
							value={name}
							errors={getApiFieldErrors("name")}
							onChange={value => {
								setName(value)
								clearApiError("name")
							}}
						/>

						<section className="grid gap-3">
							<header className="flex min-h-8 items-center justify-between gap-3">
								<h3 className="text-sm font-medium">When the description</h3>
								{conditions.length > 1 ? (
									<ToggleGroup
										type="single"
										aria-label="How conditions combine"
										value={mode}
										onValueChange={value => {
											if (value) setMode(value as "all" | "any")
										}}
									>
										<ToggleGroupItem value="all">Matches all</ToggleGroupItem>
										<ToggleGroupItem value="any">Matches any</ToggleGroupItem>
									</ToggleGroup>
								) : null}
							</header>
							{conditions.map((condition, i) => (
								<div key={condition.key} className="grid gap-2">
									{i > 0 ? (
										<span className="text-xs text-muted-foreground">
											{mode === "all" ? "and" : "or"}
										</span>
									) : null}
									<div className="flex items-start gap-2">
										<SelectField
											id={`rule-operator-${condition.key}`}
											className="w-36 shrink-0 sm:w-40"
											value={condition.operator}
											items={RULE_OPERATORS}
											onChange={value =>
												setCondition(condition.key, {
													operator: value as RuleCondition["operator"],
												})
											}
										/>
										<Input
											aria-label="Text to look for"
											placeholder="e.g. SPOTIFY"
											className="font-mono"
											value={condition.value}
											aria-invalid={
												!!apiErrors[`conditions.items.${i}.value`]
											}
											onChange={event =>
												setCondition(condition.key, {
													value: event.target.value,
												})
											}
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											aria-label="Remove condition"
											className={cn(conditions.length === 1 && "invisible")}
											onClick={() =>
												setConditions(rows =>
													rows.filter(row => row.key !== condition.key),
												)
											}
										>
											<UiIcon icon="lucide:x" />
										</Button>
									</div>
								</div>
							))}
							<FieldError
								errors={[...new Set(conditionErrors)].map(message => ({ message }))}
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="w-fit"
								onClick={() =>
									setConditions(rows => [
										...rows,
										{
											operator: "contains",
											value: "",
											key: crypto.randomUUID(),
										},
									])
								}
							>
								<UiIcon icon="lucide:plus" /> Add condition
							</Button>
						</section>

						<section className="grid gap-3">
							<header>
								<h3 className="text-sm font-medium">Prepare the Record</h3>
								<p className="text-xs text-muted-foreground">
									Suggest offers a one-click chip under the field. Autofill fills
									the field when the record creator opens.
								</p>
							</header>
							<div className="grid gap-3">
								{RULE_FIELDS.map(({ value: field, label }) => (
									<div
										key={field}
										className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1.5 sm:grid-cols-[7rem_minmax(0,1fr)_auto]"
									>
										<label
											htmlFor={`rule-${field}`}
											className="self-center text-sm sm:self-start sm:pt-1.5 sm:text-muted-foreground"
										>
											{label}
										</label>
										{/* Phones put the label beside its mode toggle, the value underneath. */}
										<div className="order-last col-span-2 sm:order-none sm:col-span-1">
											{valueInput(field)}
										</div>
										<ToggleGroup
											type="single"
											aria-label={`How to use the ${label.toLowerCase()}`}
											className="p-0.5"
											disabled={!actions[field]}
											value={actions[field]?.mode ?? ""}
											onValueChange={value => {
												if (value)
													setAction(
														field,
														actions[field]?.value,
														value as RuleMode,
													)
											}}
										>
											<ToggleGroupItem value="suggest">
												Suggest
											</ToggleGroupItem>
											<ToggleGroupItem value="autofill">
												Autofill
											</ToggleGroupItem>
										</ToggleGroup>
									</div>
								))}
							</div>
							<FieldError errors={getApiFieldErrors("actions")} />
						</section>
					</form>

					<aside className="grid max-h-[28rem] min-h-72 grid-rows-[auto_minmax(0,1fr)] content-start gap-3 rounded-lg bg-muted/40 p-3 md:max-h-[32rem]">
						<header className="grid gap-2">
							<h3 className="text-sm font-medium tabular-nums">
								{ready && matches !== undefined
									? pluralize(matches.length, "matching Statement")
									: "Matching Statements"}
							</h3>
							<ToggleGroup
								type="single"
								aria-label="Statements this rule applies to"
								className="w-full"
								value={dataset}
								onValueChange={value => {
									if (value) setDataset(value as RuleDataset)
								}}
							>
								{RULE_DATASETS.map(d => (
									<ToggleGroupItem
										key={d.value}
										value={d.value}
										className="flex-1"
									>
										{d.label}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
							<p className="text-xs text-muted-foreground">
								{dataset === "both"
									? "Applies to every Statement, including future imports."
									: dataset === "existing"
										? rule
											? "Applies only to Statements that existed when this rule was created."
											: "Applies only to Statements already imported."
										: rule
											? "Applies only to Statements imported after this rule was created."
											: "Applies only to Statements you import from now on."}
							</p>
						</header>
						<div className="-mx-1 overflow-y-auto px-1">
							{!ready ? (
								<p className="py-8 text-center text-xs text-muted-foreground">
									Type some text to look for and matching Statements appear here.
								</p>
							) : matches === undefined ? null : matches.length === 0 ? (
								<p className="py-8 text-center text-xs text-muted-foreground">
									{dataset === "new"
										? "No new Statements match yet."
										: "No Statements match these conditions."}
								</p>
							) : (
								<ul className="divide-y">
									{matches.slice(0, PREVIEW_LIMIT).map(s => (
										<li key={s.id} className="flex items-start gap-3 py-2">
											<span className="min-w-0 flex-1">
												<span className="block font-mono text-xs break-all">
													{highlight(s.description, needles)}
												</span>
												<span className="text-[0.6875rem] text-muted-foreground">
													{s.account.name} · {formatDatetime(s.datetime)}
												</span>
											</span>
											<span
												className={cn(
													"shrink-0 text-xs font-medium tabular-nums",
													amountTone(s.amount),
												)}
											>
												{formatCurrency(s.amount)}
											</span>
										</li>
									))}
									{matches.length > PREVIEW_LIMIT ? (
										<li className="py-2 text-center text-xs text-muted-foreground">
											and {matches.length - PREVIEW_LIMIT} more
										</li>
									) : null}
								</ul>
							)}
						</div>
					</aside>
				</div>

				<DialogFooter>
					{rule ? (
						<Button
							type="button"
							variant="destructive"
							className="mr-auto"
							onClick={handleDelete}
						>
							<UiIcon icon="lucide:trash-2" /> Delete
						</Button>
					) : null}
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Cancel
							</Button>
						}
					/>
					<Button type="submit" form="statement-rule-form">
						{rule ? "Save changes" : "Create rule"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

/** Marks every case-insensitive occurrence of the looked-for text. */
function highlight(text: string, needles: string[]) {
	if (!needles.length) return text
	const pattern = needles
		.toSorted((a, b) => b.length - a.length)
		.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
		.join("|")
	// Splitting on a capture group puts the matched text at every odd index.
	return text.split(new RegExp(`(${pattern})`, "gi")).map((part, i) =>
		i % 2 ? (
			<mark key={i} className="rounded-sm bg-primary/15 text-foreground">
				{part}
			</mark>
		) : (
			part
		),
	)
}
