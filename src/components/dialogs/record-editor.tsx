import { useForm, useStore } from "@tanstack/react-form"
import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion } from "framer-motion"
import { DateTime } from "luxon"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { AllocationMismatch } from "@/components/allocate-bar"
import {
	AllocationList,
	allocatedOf,
	PreviewHeader,
	PreviewItem,
	PreviewSection,
} from "@/components/dialogs/item-preview"
import StatementDialog from "@/components/dialogs/statement"
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
	DialogFooter,
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
	nested = false,
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
	/** Opened from a Statement preview, so its Statements do not open another level. */
	nested?: boolean
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
	const current = live ?? { ...record, statements }
	const [openStatement, setOpenStatement] = useState<Statement | null>(null)

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
			{monthlyBudgets === undefined || live === undefined ? null : (
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
							onOpenStatement={nested ? undefined : setOpenStatement}
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

					{openStatement ? (
						<StatementDialog
							statement={openStatement}
							isOpen
							setIsOpen={isOpen => {
								if (!isOpen) setOpenStatement(null)
							}}
							container={container}
							nested
						/>
					) : null}
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
						toast.error("Unable to save this Record.")
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
				return true
			} catch {
				setArmed(false)
				toast.error("Unable to delete this Record.")
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
			<IconifyIcon icon="lucide:trash-2" data-icon="inline-start" />
			{armed ? "Yes, delete Record" : "Delete"}
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
			title="Allocate Statements to Record"
			placeholder="Search Statements with amounts available to allocate..."
			target={round2(mismatch.amount - mismatch.allocated)}
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
					<IconifyIcon icon="lucide:link-2" data-icon="inline-start" />
					Allocate statement
				</Button>
			}
		/>
	)

	return (
		<>
			<RecordDialogHeader record={record} label="Edit Record">
				{/* Analytics sits under the details, and narrow screens stack the allocations under it. */}
				<div className="flex gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => jump(analyticsSection.current)}
					>
						<IconifyIcon icon="lucide:arrow-down" data-icon="inline-start" />
						Analytics
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="lg:hidden"
						onClick={() => jump(allocationsSection.current)}
					>
						<IconifyIcon icon="lucide:arrow-down" data-icon="inline-start" />
						Allocations <span aria-hidden="true">·</span>{" "}
						<span className="tabular-nums">{formStatements.length}</span>
					</Button>
				</div>
			</RecordDialogHeader>

			<DialogBody>
				<form
					id="record-editor-form"
					ref={formElement}
					// From the preview, the form fades in where the preview was; a popup opening straight
					// to the form enters as a whole.
					className={cn(
						"grid gap-8 lg:grid-cols-2",
						focusFirstField && "fade-in animate-in duration-150 ease-out",
					)}
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					<div className="flex min-w-0 flex-col gap-8">
						<PreviewSection title="Record information">
							<FieldGroup>
								<form.Field name="title">
									{field => (
										<TextField
											id={field.name}
											label="Title"
											value={field.state.value}
											suggestions={completions?.titles ?? []}
											errors={mergeErrors(
												field.state.meta.errors,
												field.name,
											)}
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
											errors={mergeErrors(
												field.state.meta.errors,
												field.name,
											)}
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
											errors={mergeErrors(
												field.state.meta.errors,
												field.name,
											)}
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
											errors={mergeErrors(
												field.state.meta.errors,
												field.name,
											)}
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
											errors={mergeErrors(
												field.state.meta.errors,
												field.name,
											)}
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
											errors={mergeErrors(
												field.state.meta.errors,
												field.name,
											)}
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
											errors={mergeErrors(
												field.state.meta.errors,
												field.name,
											)}
											onChange={value => {
												field.handleChange(value)
												clearApiError(field.name)
											}}
										/>
									)}
								</form.Field>
							</FieldGroup>
						</PreviewSection>

						{/* Analytics follows the details; the allocations take the other column. */}
						<div ref={analyticsSection} className="scroll-mt-2">
							<RecordAnalyticsFields
								treatment={analytics.treatment}
								categoryTreatment={analyticsCategory?.analytics_treatment}
								amount={analytics.amount}
								monthlyBudgetId={analytics.monthlyBudgetId}
								monthlyBudgetSource={analytics.monthlyBudgetSource}
								categoryMonthlyBudgetId={
									analyticsCategory?.default_monthly_budget_id
								}
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
					</div>

					<div ref={allocationsSection} className="min-w-0 scroll-mt-2">
						<PreviewSection
							title="Statement allocations"
							description={allocatedOf(mismatch.allocated, mismatch.amount)}
							action={!!formStatements.length && attachStatementsSheet}
						>
							<div className="flex flex-col gap-2">
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
																		? "ring-destructive/50"
																		: null,
																)}
															>
																<CardHeader>
																	<CardTitle className="text-sm leading-5">
																		{statement.description ||
																			"No description"}
																	</CardTitle>
																	<CardDescription>
																		{statement.account.name} ·{" "}
																		{formatDatetime(
																			statement.datetime,
																		)}
																	</CardDescription>
																	<CardAction>
																		<Button
																			type="button"
																			variant="destructive"
																			size="icon"
																			aria-label={`Remove ${statement.description || "No description"}`}
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
																			<IconifyIcon icon="lucide:trash-2" />
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
																				? "text-destructive"
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
											<Empty className="rounded-lg border border-dashed">
												<EmptyHeader>
													<EmptyMedia variant="icon">
														<IconifyIcon icon="lucide:credit-card" />
													</EmptyMedia>
													<EmptyTitle>No Statements</EmptyTitle>
													<EmptyDescription>
														No Statements selected for allocation.
													</EmptyDescription>
												</EmptyHeader>
												<EmptyContent>{attachStatementsSheet}</EmptyContent>
											</Empty>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</PreviewSection>
					</div>

					{/* Phones end the form with Delete, so the footer is just Cancel and Save. */}
					{deleteButton("w-full sm:hidden")}
				</form>
			</DialogBody>

			<DialogFooter className="sm:items-center">
				{/* Phones keep Delete in the form, so this holds only an error there. */}
				<div
					className={cn(
						"mr-auto flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center",
						!submitError && "max-sm:hidden",
					)}
				>
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
				<Button type="submit" form="record-editor-form" disabled={locked}>
					Save changes
				</Button>
			</DialogFooter>
		</>
	)
}

/** The Record's icon, title and status, with its amount and time beneath, above either mode. */
function RecordDialogHeader({
	record,
	label,
	children,
}: {
	record: Record
	label: string
	children?: React.ReactNode
}) {
	return (
		<PreviewHeader
			media={<Icon {...record.category} size={18} />}
			label={label}
			title={record.title}
			badge={<PendingBadge record={record} />}
			details={[
				<RecordAmount key="amount" record={record} showAccumulated={false} />,
				formatDatetime(record.datetime),
				record.category.name,
			]}
		>
			{children}
		</PreviewHeader>
	)
}

/** What a row opens: the Record laid out like its form, read-only, with Edit to change it. */
function RecordPreview({
	record,
	editButton,
	focusEdit,
	onEdit,
	onOpenStatement,
}: {
	record: Record & { statements: RecordStatement[] }
	editButton: React.RefObject<HTMLButtonElement | null>
	/** Back from the form: Edit takes focus again, where the Save or Cancel press left off. */
	focusEdit: boolean
	onEdit: () => void
	onOpenStatement?: (statement: RecordStatement) => void
}) {
	useEffect(() => {
		if (focusEdit) editButton.current?.focus()
	}, [focusEdit, editButton])

	const usesMonthlyBudget = canUseMonthlyBudget(record.analytics_treatment, record.amount)

	return (
		<>
			<RecordDialogHeader record={record} label="Record" />

			<DialogBody>
				{/* Sections sit where the form puts them, so Edit swaps values for fields in place. */}
				{/* Back from the form, the preview fades in where it was; opening, the popup enters whole. */}
				<div
					className={cn(
						"grid gap-8 lg:grid-cols-2",
						focusEdit && "fade-in animate-in duration-150 ease-out",
					)}
				>
					<div className="flex min-w-0 flex-col gap-8">
						{/* The header already carries the amount, time and Category. */}
						<PreviewSection title="Record information">
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
						</PreviewSection>

						<PreviewSection title="Analytics" className="rounded-lg border p-4">
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
										<span className="grid justify-items-start gap-0.5">
											<MonthlyBudgetBadge
												name={record.monthly_budget?.name ?? "Unbudgeted"}
												color={record.monthly_budget?.color}
											/>
											{record.monthly_budget_choice.kind === "category" ? (
												<span className="text-xs text-muted-foreground">
													Set by {record.category.name}
												</span>
											) : null}
										</span>
									) : (
										<span className="text-muted-foreground">Not counted</span>
									)}
								</PreviewItem>
							</dl>
						</PreviewSection>
					</div>

					<PreviewSection
						title="Statement allocations"
						description={allocatedOf(record.allocated_amount, record.amount)}
					>
						<AllocationList
							items={record.statements}
							empty={{
								icon: "lucide:credit-card",
								title: "No Statements",
								description: "Edit the Record to allocate a Statement.",
							}}
							render={statement => ({
								title: statement.description || "No description",
								details: [
									statement.account.name,
									formatDatetime(statement.datetime),
								],
								allocated: statement.pivot?.amount ?? 0,
								amount: statement.amount,
							})}
							onOpen={onOpenStatement}
						/>
					</PreviewSection>
				</div>
			</DialogBody>

			{/* The corner X and Escape close. */}
			<DialogFooter>
				<Button ref={editButton} type="button" onClick={onEdit}>
					<IconifyIcon icon="lucide:pencil" data-icon="inline-start" />
					Edit
				</Button>
			</DialogFooter>
		</>
	)
}
