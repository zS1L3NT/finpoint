import { useForm, useStore } from "@tanstack/react-form"
import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion } from "framer-motion"
import { DateTime } from "luxon"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { AllocationMismatch } from "@/components/allocate-bar"
import AmountField from "@/components/form/amount-field"
import CategoryField from "@/components/form/category-field"
import DatetimeField from "@/components/form/datetime-field"
import RecordAnalyticsFields from "@/components/form/record-analytics-fields"
import TextField from "@/components/form/text-field"
import TextareaField from "@/components/form/textarea-field"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import MonthlyBudgetBadge from "@/components/monthly-budget-badge"
import RecordAmount from "@/components/record-amount"
import StatementSearchSheet from "@/components/sheets/statement-search"
import { PendingBadge } from "@/components/table/record-columns"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty"
import { FieldGroup } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useHistory } from "@/history"
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { useDialogCloseAnimation } from "@/hooks/use-dialog-close-animation"
import { useDefaultFilterEndDateToday, useDefaultFilterStartDate } from "@/hooks/use-settings"
import { useSubmitLock } from "@/hooks/use-submit-lock"
import { canUseMonthlyBudget, treatmentLabel } from "@/lib/analytics"
import { FIELD_NOTE_COLLAPSE_MOTION, SPRING, TRANSITION } from "@/lib/motion"
import { cn, formatCurrency, formatDatetime, round2 } from "@/lib/utils"
import { listMonthlyBudgets } from "@/logic/monthly-budgets"
import {
	ConflictError,
	deleteRecord,
	getRecord,
	recordCompletions,
	updateRecord,
} from "@/logic/records"
import { ValidationError } from "@/logic/validate"
import { pathRecord, pathRecords } from "@/routes"
import type { Allocation, CategoryWithChildren, Record, Statement } from "@/types"

type RecordStatement = Statement & { pivot?: Allocation }

/**
 * A Record in a modal. Rows open it as a read-only preview, and Edit swaps the same modal to the
 * form; `initialMode="edit"` skips the preview for callers that are already showing the Record.
 */
export default function RecordEditorDialog({
	record,
	statements,
	categories,
	isOpen,
	setIsOpen: onOpenChange,
	trigger,
	container,
	initialMode = "view",
}: {
	record: Record
	statements: RecordStatement[]
	categories: CategoryWithChildren[]
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	trigger?: React.ReactElement
	/** Where the dialog mounts: the sheet it was opened from, when there is one. */
	container?: HTMLElement | null
	initialMode?: "view" | "edit"
}) {
	const { open, setIsOpen, onOpenChangeComplete } = useDialogCloseAnimation(isOpen, onOpenChange)
	const [mode, setMode] = useState(initialMode)
	// Whether this opening has been to the form, so the preview hands focus back to Edit.
	const [hasEdited, setHasEdited] = useState(false)
	const editButton = useRef<HTMLButtonElement>(null)
	const { locked, run } = useSubmitLock(isOpen && mode === "edit")
	// Resolve the Monthly Budget lookup before the popup mounts so the
	// Analytics select keeps its laid-out label from the first frame.
	const monthlyBudgets = useLiveQuery(() => listMonthlyBudgets(), [])
	// The preview follows saves, from this form or another tab, as they land.
	const live = useLiveQuery(() => getRecord(record.id).catch(() => null), [record.id])
	const current = live ? live : { ...record, statements }

	const edit = () => {
		setHasEdited(true)
		setMode("edit")
	}
	const finishEditing = () => (initialMode === "view" ? setMode("view") : setIsOpen(false))

	return (
		<Dialog
			open={open}
			onOpenChangeComplete={onOpenChangeComplete}
			onOpenChange={isOpen => {
				setIsOpen(isOpen)
				if (isOpen) {
					setMode(initialMode)
					setHasEdited(false)
				}
			}}
		>
			{trigger && <DialogTrigger render={trigger} />}
			{monthlyBudgets === undefined ? null : (
				<DialogContent
					container={container}
					// The preview opens on Edit, so Enter goes straight to the form.
					initialFocus={mode === "view" ? editButton : undefined}
					className="md:max-w-4xl"
				>
					{mode === "view" ? (
						<RecordPreview
							record={current}
							editButton={editButton}
							focusEdit={hasEdited}
							onEdit={edit}
						/>
					) : (
						<RecordEditForm
							// Straight to the form, the props are the seed: the allocator adds the
							// Statements it is allocating. After the preview, the live Record is.
							record={initialMode === "edit" ? record : current}
							statements={initialMode === "edit" ? statements : current.statements}
							categories={categories}
							monthlyBudgets={monthlyBudgets}
							locked={locked}
							run={run}
							focusFirstField={initialMode === "view"}
							close={() => setIsOpen(false)}
							onDone={finishEditing}
						/>
					)}
				</DialogContent>
			)}
		</Dialog>
	)
}

function RecordEditForm({
	record,
	statements,
	categories,
	monthlyBudgets,
	locked,
	run,
	focusFirstField,
	close,
	onDone,
}: {
	record: Record
	statements: RecordStatement[]
	categories: CategoryWithChildren[]
	monthlyBudgets: Awaited<ReturnType<typeof listMonthlyBudgets>>
	locked: boolean
	run: (operation: () => Promise<boolean>) => Promise<void>
	/** Opened from the preview: the form takes focus from the Edit button it replaced. */
	focusFirstField: boolean
	close: () => void
	/** Saved or cancelled: back to the preview, or closed when there was none. */
	onDone: () => void
}) {
	const { navigateBack } = useHistory()
	const defaultFilterStartDate = useDefaultFilterStartDate()
	const defaultFilterEndDateToday = useDefaultFilterEndDateToday()
	const defaultFilterEndDate = defaultFilterEndDateToday
		? DateTime.now().toFormat("yyyy-MM-dd")
		: undefined

	const completions = useLiveQuery(() => recordCompletions(), []) ?? {
		titles: [],
		locations: [],
		peoples: [],
	}
	// Statements attached in this form that the `statements` prop does not hold (yet).
	const [attached, setAttached] = useState(statements)
	const [isAttachingStatement, setIsAttachingStatement] = useState(false)
	const [submitError, setSubmitError] = useState("")
	// The first Delete click arms; the second deletes. Closing the dialog disarms.
	const [armed, setArmed] = useState(false)

	const { mergeErrors, clearApiError, setApiErrors } = useApiFormErrors()
	const formElement = useRef<HTMLFormElement>(null)
	useEffect(() => {
		// Fine pointers only: on touch screens a focused field would raise the keyboard unasked.
		if (focusFirstField && matchMedia("(pointer: fine)").matches) {
			formElement.current?.querySelector("input")?.focus()
		}
	}, [focusFirstField])

	const categoriesFlat = categories.flatMap(category => [category, ...category.children])

	const form = useForm({
		defaultValues: {
			title: record.title,
			people: record.people ?? "",
			location: record.location ?? "",
			datetime: record.datetime.replace(" ", "T"),
			amount: record.amount,
			category_id: record.category.id,
			analytics_treatment:
				record.treatment_choice.kind === "explicit" ? record.treatment_choice.value : "",
			monthly_budget_id:
				record.monthly_budget_choice.kind === "explicit"
					? record.monthly_budget_choice.id
					: "",
			monthly_budget_source:
				record.monthly_budget_choice.kind === "category"
					? ("category" as const)
					: ("manual" as const),
			description: record.description ?? "",
			statements: statements.map(statement => ({
				id: statement.id,
				amount: statement.pivot?.amount ?? statement.allocable_amount,
			})),
			// The revision the form was seeded from, so a write from another tab still conflicts.
			revision: record.revision,
		},
		onSubmit: ({ value }) =>
			run(async () => {
				setSubmitError("")
				try {
					await updateRecord(record.id, {
						title: value.title,
						people: value.people,
						location: value.location,
						description: value.description,
						datetime: value.datetime,
						amount: value.amount,
						category_id: value.category_id,
						analytics_treatment: value.analytics_treatment || null,
						monthly_budget_id: value.monthly_budget_id || null,
						monthly_budget_source: value.monthly_budget_source,
						revision: value.revision,
						statements: value.statements,
					})
					onDone()
					return true
				} catch (cause) {
					if (cause instanceof ValidationError) {
						setApiErrors(cause.errors)
						setSubmitError("Correct the highlighted fields, then save again.")
					} else if (cause instanceof ConflictError) {
						setSubmitError(cause.message)
						toast.error(cause.message)
					} else {
						setSubmitError(
							"Unable to save this Record. Refresh the page and try again.",
						)
						toast.error("Unable to save this record.")
					}
					return false
				}
			}),
		onSubmitInvalid: () => setSubmitError("Correct the highlighted fields, then save again."),
	})

	const handleDelete = async () => {
		if (!armed) {
			setArmed(true)
			return
		}
		await run(async () => {
			try {
				await deleteRecord(record.id)
				close()

				if (location.pathname === pathRecord(record.id)) {
					navigateBack({
						name: "Records",
						url: pathRecords(
							defaultFilterStartDate || defaultFilterEndDate
								? {
										start_date: defaultFilterStartDate ?? undefined,
										end_date: defaultFilterEndDate,
									}
								: undefined,
						),
					})
				}
				return true
			} catch {
				setArmed(false)
				toast.error("Unable to delete this record.")
				return false
			}
		})
	}

	const mismatch = useStore(form.store, state => ({
		amount: round2(state.values.amount),
		allocated: round2(state.values.statements.reduce((acc, el) => acc + el.amount, 0)),
	}))
	const isPendingAmount = mismatch.allocated !== mismatch.amount
	const analytics = useStore(form.store, state => ({
		treatment: state.values.analytics_treatment,
		categoryId: state.values.category_id,
		amount: state.values.amount,
		monthlyBudgetId: state.values.monthly_budget_id,
		monthlyBudgetSource: state.values.monthly_budget_source,
	}))
	const analyticsCategory = categoriesFlat.find(category => category.id === analytics.categoryId)
	const formStatements = useStore(form.store, state => state.values.statements)

	const deleteButton = (className: string) => (
		<Button
			type="button"
			variant="destructive"
			disabled={locked}
			onClick={handleDelete}
			className={className}
		>
			<IconifyIcon icon="lucide:trash-2" /> {armed ? "Yes, delete Record" : "Delete"}
		</Button>
	)

	const allocationsSection = useRef<HTMLDivElement>(null)
	const analyticsSection = useRef<HTMLDivElement>(null)
	const jump = (section: HTMLElement | null) =>
		section?.scrollIntoView({
			block: "start",
			behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
		})
	const attachStatementsSheet = (
		<StatementSearchSheet
			title="Allocate statements to record"
			placeholder="Search statements with amounts available to allocate..."
			target={
				Math.round(
					(Number(analytics.amount) -
						formStatements.reduce((sum, s) => sum + Number(s.amount), 0)) *
						100,
				) / 100
			}
			filters={{
				is_allocable: true,
				exclude_ids: formStatements.map(s => s.id),
				start_date: defaultFilterStartDate ?? undefined,
				end_date: defaultFilterEndDate,
			}}
			isOpen={isAttachingStatement}
			setIsOpen={setIsAttachingStatement}
			handler={async statement => {
				if (form.getFieldValue("statements").some(s => s.id === statement.id)) {
					return
				}

				setAttached(prev =>
					prev.some(s => s.id === statement.id) ? prev : [...prev, statement],
				)
				form.setFieldValue("statements", [
					...form.getFieldValue("statements"),
					{ id: statement.id, amount: statement.allocable_amount },
				])
			}}
			trigger={
				<Button variant="outline" className="w-fit">
					<IconifyIcon icon="lucide:link-2" />
					Allocate statement
				</Button>
			}
		/>
	)

	return (
		<>
			<RecordDialogHeader record={record} title="Edit Record">
				{/* Narrow screens stack the sections, so these jump past the details. */}
				<div className="flex gap-2 lg:hidden">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => jump(analyticsSection.current)}
					>
						<IconifyIcon icon="lucide:arrow-down" />
						Analytics
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => jump(allocationsSection.current)}
					>
						<IconifyIcon icon="lucide:arrow-down" />
						Allocations · {formStatements.length}
					</Button>
				</div>
			</RecordDialogHeader>

			<DialogBody>
				<form
					id="record-editor-form"
					ref={formElement}
					className="grid gap-8 lg:grid-cols-2 lg:grid-rows-[auto_1fr]"
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					<div className="flex flex-col gap-4 lg:row-span-2">
						<p className="text-sm font-semibold">Record Information</p>

						<FieldGroup>
							<form.Field name="title">
								{field => (
									<TextField
										id={field.name}
										label="Title"
										value={field.state.value}
										suggestions={completions?.titles ?? []}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										onChange={value => {
											field.handleChange(value)
											clearApiError(field.name)
										}}
									/>
								)}
							</form.Field>
							<form.Field name="people">
								{field => (
									<TextField
										id={field.name}
										label="People"
										value={field.state.value}
										suggestions={completions?.peoples ?? []}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										onChange={value => {
											field.handleChange(value)
											clearApiError(field.name)
										}}
									/>
								)}
							</form.Field>
							<form.Field name="location">
								{field => (
									<TextField
										id={field.name}
										label="Location"
										value={field.state.value}
										suggestions={completions?.locations ?? []}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										onChange={value => {
											field.handleChange(value)
											clearApiError(field.name)
										}}
									/>
								)}
							</form.Field>
							<form.Field name="datetime">
								{field => (
									<DatetimeField
										id={field.name}
										value={field.state.value}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										onChange={value => {
											field.handleChange(value)
											clearApiError(field.name)
										}}
									/>
								)}
							</form.Field>
							<form.Field name="amount">
								{field => (
									<AmountField
										id={field.name}
										label="Amount"
										value={field.state.value}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										onChange={value => {
											field.handleChange(value)
											clearApiError(field.name)
										}}
									/>
								)}
							</form.Field>
							<AnimatePresence initial={false}>
								{isPendingAmount && (
									<motion.div
										className="overflow-hidden"
										{...FIELD_NOTE_COLLAPSE_MOTION}
									>
										<AllocationMismatch
											allocated={mismatch.allocated}
											onUseAllocated={() => {
												form.setFieldValue("amount", mismatch.allocated)
												clearApiError("amount")
											}}
										/>
									</motion.div>
								)}
							</AnimatePresence>
							<form.Field name="category_id">
								{field => (
									<CategoryField
										id={field.name}
										label="Category"
										value={field.state.value}
										categories={categories}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										onChange={value => {
											field.handleChange(value?.id ?? "")
											if (
												form.getFieldValue("monthly_budget_source") ===
												"category"
											) {
												form.setFieldValue(
													"monthly_budget_id",
													value?.default_monthly_budget_id ?? "",
												)
											}
											clearApiError(field.name)
										}}
									/>
								)}
							</form.Field>
							<form.Field name="description">
								{field => (
									<TextareaField
										id={field.name}
										label="Description"
										value={field.state.value}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										onChange={value => {
											field.handleChange(value)
											clearApiError(field.name)
										}}
									/>
								)}
							</form.Field>
						</FieldGroup>
					</div>

					{/* Wide screens set Analytics under the allocations, so the shorter column fills. */}
					<div
						ref={analyticsSection}
						className="scroll-mt-2 lg:col-start-2 lg:row-start-2"
					>
						<RecordAnalyticsFields
							treatment={analytics.treatment}
							categoryTreatment={analyticsCategory?.analytics_treatment}
							amount={analytics.amount}
							monthlyBudgetId={analytics.monthlyBudgetId}
							monthlyBudgetSource={analytics.monthlyBudgetSource}
							categoryMonthlyBudgetId={analyticsCategory?.default_monthly_budget_id}
							monthlyBudgets={monthlyBudgets}
							onTreatmentChange={value =>
								form.setFieldValue("analytics_treatment", value)
							}
							onMonthlyBudgetChange={(value, source) => {
								form.setFieldValue("monthly_budget_id", value)
								form.setFieldValue("monthly_budget_source", source)
							}}
						/>
					</div>

					<div
						ref={allocationsSection}
						className="flex scroll-mt-2 flex-col gap-4 lg:col-start-2 lg:row-start-1"
					>
						<div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<AllocationsHeading
								allocated={mismatch.allocated}
								amount={mismatch.amount}
							/>

							{!!formStatements.length && attachStatementsSheet}
						</div>

						<div className="flex flex-col gap-2">
							<ScrollArea className="h-fit max-h-200">
								<div className="relative flex flex-col gap-2">
									<AnimatePresence initial={false} mode="popLayout">
										{formStatements.map(({ id }, index) => (
											<motion.div
												key={id}
												className="p-0.5"
												layout="position"
												initial={{ opacity: 0, y: 6 }}
												animate={{
													opacity: 1,
													y: 0,
													transition: TRANSITION.base,
												}}
												exit={{
													opacity: 0,
													scale: 0.98,
													transition: TRANSITION.fast,
												}}
												transition={{ layout: SPRING.snappy }}
											>
												<form.Field
													name={`statements[${index}].amount` as const}
												>
													{field => {
														const statement =
															// biome-ignore lint/style/noNonNullAssertion: Every form Statement is in the prop or was attached here
															(statements.find(s => s.id === id) ??
																attached.find(s => s.id === id))!

														const errors = mergeErrors(
															field.state.meta.errors,
															field.name,
														)
														const allocable = round2(
															statement.allocable_amount +
																(statement.pivot?.amount ?? 0),
														)

														const percent =
															allocable === 0
																? 0
																: (field.state.value / allocable) *
																	100

														return (
															<Card
																className={cn(
																	errors.length
																		? "border-destructive/50"
																		: null,
																)}
															>
																<CardHeader>
																	<CardTitle className="text-sm leading-5">
																		{statement.description}
																	</CardTitle>
																	<CardDescription>
																		{statement.account.name} ·{" "}
																		{formatDatetime(
																			statement.datetime,
																		)}
																	</CardDescription>
																	<CardAction className="text-sm font-semibold">
																		<Button
																			type="button"
																			variant="destructive"
																			aria-label={`Remove ${statement.description}`}
																			onClick={() => {
																				form.setFieldValue(
																					"statements",
																					form
																						.getFieldValue(
																							"statements",
																						)
																						.filter(
																							s =>
																								s.id !==
																								id,
																						),
																				)
																			}}
																		>
																			<IconifyIcon icon="lucide:trash" />
																		</Button>
																	</CardAction>
																</CardHeader>
																<CardContent className="flex flex-col gap-4">
																	<AmountField
																		id={field.name}
																		label="Amount"
																		value={field.state.value}
																		errors={errors}
																		suffix={`of ${formatCurrency(allocable)}`}
																		onChange={value => {
																			field.handleChange(
																				value,
																			)
																			clearApiError(
																				field.name,
																			)
																		}}
																	/>
																	<Progress
																		value={percent}
																		className={cn(
																			"transition-colors duration-150 ease-out",
																			percent > 100
																				? "text-red-400"
																				: null,
																		)}
																	/>
																</CardContent>
															</Card>
														)
													}}
												</form.Field>
											</motion.div>
										))}
									</AnimatePresence>
								</div>
							</ScrollArea>

							<AnimatePresence initial={false}>
								{!formStatements.length && (
									<motion.div
										key="empty"
										initial={{ opacity: 0, y: 6 }}
										animate={{
											opacity: 1,
											y: 0,
											transition: TRANSITION.base,
										}}
										exit={{
											opacity: 0,
											scale: 0.98,
											transition: TRANSITION.fast,
										}}
									>
										<Empty className="border border-dashed">
											<EmptyHeader>
												<EmptyMedia variant="icon">
													<IconifyIcon icon="lucide:credit-card" />
												</EmptyMedia>
												<EmptyTitle>No Statements</EmptyTitle>
												<EmptyDescription>
													No statements selected for allocation.
												</EmptyDescription>
											</EmptyHeader>
											<EmptyContent>{attachStatementsSheet}</EmptyContent>
										</Empty>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>

					{/* Phones end the form with Delete, so the footer is just Cancel and Save. */}
					{deleteButton("w-full sm:hidden")}
				</form>
			</DialogBody>

			<DialogFooter className="flex-row flex-wrap items-center">
				<div className="mr-auto flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
					{deleteButton("max-sm:hidden")}
					{submitError ? (
						<p
							className="fade-in animate-in text-xs text-destructive duration-150 ease-out"
							aria-live="polite"
						>
							{submitError}
						</p>
					) : null}
				</div>
				<Button type="button" variant="outline" onClick={onDone}>
					Cancel
				</Button>
				<Button type="button" disabled={locked} onClick={() => void form.handleSubmit()}>
					Save changes
				</Button>
			</DialogFooter>
		</>
	)
}

/** The Record's icon, title and status, with its amount and time beneath, above either mode. */
function RecordDialogHeader({
	record,
	title,
	children,
}: {
	record: Record
	/** Names the dialog, as a small label over the Record's own title. */
	title: string
	children?: React.ReactNode
}) {
	return (
		<DialogHeader className="-mx-4 gap-3 border-b px-4 pr-12 pb-4">
			<div className="flex min-w-0 items-start gap-3">
				<Icon {...record.category} size={18} />
				<div className="grid min-w-0 gap-0.5">
					<DialogTitle className="text-xs font-medium text-muted-foreground">
						{title}
					</DialogTitle>
					<p className="flex min-w-0 items-center gap-2 text-base font-semibold tracking-tight">
						<span className="truncate">{record.title}</span>
						<PendingBadge record={record} />
					</p>
					<DialogDescription className="flex min-w-0 flex-wrap items-center gap-x-1.5">
						<span className="flex items-center gap-x-1.5">
							<RecordAmount record={record} showAccumulated={false} />·{" "}
							{formatDatetime(record.datetime)}
						</span>
						{/* Phones give the Category its own line, so no separator starts a line. */}
						<span className="max-sm:basis-full">
							<span className="max-sm:hidden">· </span>
							{record.category.name}
						</span>
					</DialogDescription>
				</div>
			</div>
			{children}
		</DialogHeader>
	)
}

/** Both modes total the Allocations under this heading; the form's total follows its inputs. */
function AllocationsHeading({ allocated, amount }: { allocated: number; amount: number }) {
	return (
		<div className="grid gap-0.5">
			<p className="text-sm font-semibold">Statement allocations</p>
			<p className="text-xs text-muted-foreground tabular-nums">
				{formatCurrency(allocated)} of {formatCurrency(amount)} allocated
			</p>
		</div>
	)
}

function PreviewItem({
	label,
	className,
	children,
}: {
	label: string
	className?: string
	children: React.ReactNode
}) {
	return (
		<div className={cn("grid min-w-0 content-start gap-1", className)}>
			<dt className="text-xs text-muted-foreground">{label}</dt>
			<dd className="min-w-0 text-sm break-words">
				{children || <span className="text-muted-foreground">—</span>}
			</dd>
		</div>
	)
}

/** What a row opens: the Record laid out like its form, read-only, with Edit to change it. */
function RecordPreview({
	record,
	editButton,
	focusEdit,
	onEdit,
}: {
	record: Record & { statements: RecordStatement[] }
	editButton: React.RefObject<HTMLButtonElement | null>
	/** Back from the form: Edit takes focus again, where the Save or Cancel press left off. */
	focusEdit: boolean
	onEdit: () => void
}) {
	useEffect(() => {
		if (focusEdit) editButton.current?.focus()
	}, [focusEdit, editButton])

	const usesMonthlyBudget = canUseMonthlyBudget(record.analytics_treatment, record.amount)

	return (
		<>
			<RecordDialogHeader record={record} title="Record" />

			<DialogBody>
				{/* Sections sit where the form puts them, so Edit swaps values for fields in place. */}
				<div className="fade-in grid animate-in gap-8 duration-150 ease-out lg:grid-cols-2 lg:grid-rows-[auto_1fr]">
					<div className="flex flex-col gap-4 lg:row-span-2">
						{/* The header already carries the amount, time and Category. */}
						<p className="text-sm font-semibold">Record Information</p>
						<dl className="grid grid-cols-2 gap-x-6 gap-y-4">
							<PreviewItem label="People">{record.people}</PreviewItem>
							<PreviewItem label="Location">{record.location}</PreviewItem>
							<PreviewItem label="Description" className="col-span-2">
								{record.description ? (
									<span className="whitespace-pre-wrap">
										{record.description}
									</span>
								) : null}
							</PreviewItem>
						</dl>
					</div>

					<div className="grid content-start gap-4 rounded-lg border p-4 lg:col-start-2 lg:row-start-2">
						<p className="text-sm font-semibold">Analytics</p>
						<dl className="grid grid-cols-2 gap-x-6 gap-y-4">
							<PreviewItem label="Treatment">
								<span className="grid gap-0.5">
									{treatmentLabel(record.analytics_treatment)}
									{record.analytics_treatment_source === "category" ? (
										<span className="text-xs text-muted-foreground">
											Set by {record.category.name}
										</span>
									) : null}
								</span>
							</PreviewItem>
							<PreviewItem label="Monthly budget">
								{usesMonthlyBudget ? (
									<MonthlyBudgetBadge
										name={record.monthly_budget?.name ?? "Unbudgeted"}
										color={record.monthly_budget?.color}
									/>
								) : (
									<span className="text-muted-foreground">Not counted</span>
								)}
							</PreviewItem>
						</dl>
					</div>

					<div className="flex flex-col gap-4 lg:col-start-2 lg:row-start-1">
						<AllocationsHeading
							allocated={record.allocated_amount}
							amount={record.amount}
						/>
						{record.statements.length ? (
							<ul className="divide-y rounded-lg border">
								{record.statements.map(statement => (
									<li
										key={statement.id}
										className="flex min-w-0 items-center justify-between gap-4 px-3 py-2.5"
									>
										<div className="grid min-w-0 gap-0.5">
											<span className="truncate text-sm font-medium">
												{statement.description || "No description"}
											</span>
											<span className="truncate text-xs text-muted-foreground">
												{statement.account.name} ·{" "}
												{formatDatetime(statement.datetime)}
											</span>
										</div>
										<span className="grid shrink-0 justify-items-end gap-0.5 text-sm tabular-nums">
											{formatCurrency(statement.pivot?.amount ?? 0)}
											<span className="text-xs text-muted-foreground">
												of {formatCurrency(statement.amount)}
											</span>
										</span>
									</li>
								))}
							</ul>
						) : (
							<p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
								No Statements allocated. Edit the Record to allocate one.
							</p>
						)}
					</div>
				</div>
			</DialogBody>

			<DialogFooter className="flex-row items-center">
				{/* Secondary navigation, quieter than Edit; the corner X and Escape close. */}
				<Button variant="ghost" className="mr-auto text-muted-foreground" asChild>
					<Link href={pathRecord(record.id)}>
						Full page
						<IconifyIcon icon="lucide:arrow-up-right" />
					</Link>
				</Button>
				<Button ref={editButton} type="button" onClick={onEdit}>
					<IconifyIcon icon="lucide:pencil" />
					Edit
				</Button>
			</DialogFooter>
		</>
	)
}
