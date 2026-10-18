import { useForm, useStore } from "@tanstack/react-form"
import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion } from "framer-motion"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import AmountField from "@/components/form/amount-field"
import CategoryField from "@/components/form/category-field"
import DatetimeField from "@/components/form/datetime-field"
import RecordAnalyticsFields from "@/components/form/record-analytics-fields"
import TextField from "@/components/form/text-field"
import TextareaField from "@/components/form/textarea-field"
import { UiIcon as IconifyIcon } from "@/components/icon"
import StatementSearchSheet from "@/components/sheets/statement-search"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
	DialogClose,
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
import { COLLAPSE_MOTION, SPRING, TRANSITION } from "@/lib/motion"
import { cn, formatCurrency, formatDatetime, round2 } from "@/lib/utils"
import { listMonthlyBudgets } from "@/logic/monthly-budgets"
import { ConflictError, deleteRecord, recordCompletions, updateRecord } from "@/logic/records"
import { ValidationError } from "@/logic/validate"
import { pathRecord, pathRecords } from "@/routes"
import type { Allocation, CategoryWithChildren, Record, Statement } from "@/types"

export default function RecordEditorDialog({
	record,
	statements,
	categories,
	isOpen,
	setIsOpen: onOpenChange,
	trigger,
}: {
	record: Record
	statements: (Statement & { pivot?: Allocation })[]
	categories: CategoryWithChildren[]
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	trigger?: React.ReactElement
}) {
	const { open, setIsOpen, onOpenChangeComplete } = useDialogCloseAnimation(isOpen, onOpenChange)
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
	// Resolve the Monthly Budget lookup before the popup mounts so the
	// Analytics select keeps its laid-out label from the first frame.
	const monthlyBudgets = useLiveQuery(() => listMonthlyBudgets(), [])

	const [statementCache, setStatementCache] = useState(statements)
	const [isAttachingStatement, setIsAttachingStatement] = useState(false)
	const [submitError, setSubmitError] = useState("")

	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	useEffect(() => {
		setStatementCache(statements)
	}, [statements])

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
				record.analytics_treatment_source === "manual" ? record.analytics_treatment : "",
			monthly_budget_id: record.monthly_budget_id ?? "",
			monthly_budget_source:
				record.monthly_budget_source ?? ("category" as "category" | "manual"),
			description: record.description ?? "",
			statements: statements.map(statement => ({
				id: statement.id,
				amount: statement.pivot?.amount ?? statement.allocable_amount,
			})),
		},
		onSubmit: async ({ value }) => {
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
					revision: record.revision,
					statements: value.statements,
				})
				setIsOpen(false)
			} catch (cause) {
				if (cause instanceof ValidationError) {
					setApiErrors(cause.errors)
					setSubmitError("Correct the highlighted fields, then save again.")
					return
				}
				if (cause instanceof ConflictError) {
					setSubmitError(cause.message)
					toast.error(cause.message)
					return
				}
				setSubmitError("Unable to save this Record. Refresh the page and try again.")
				toast.error("Unable to save this record.")
			}
		},
		onSubmitInvalid: () => setSubmitError("Correct the highlighted fields, then save again."),
	})

	const handleDelete = async () => {
		try {
			await deleteRecord(record.id)
			setIsOpen(false)

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
		} catch {
			toast.error("Unable to delete this record.")
		}
	}

	const isPendingAmount = useStore(
		form.store,
		state =>
			round2(state.values.statements.reduce((acc, el) => acc + el.amount, 0)) !==
			round2(state.values.amount),
	)
	const analytics = useStore(form.store, state => ({
		treatment: state.values.analytics_treatment,
		categoryId: state.values.category_id,
		amount: state.values.amount,
		monthlyBudgetId: state.values.monthly_budget_id,
		monthlyBudgetSource: state.values.monthly_budget_source,
	}))
	const analyticsCategory = categoriesFlat.find(category => category.id === analytics.categoryId)
	const formStatements = useStore(form.store, state => state.values.statements)
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
				is_allocable: "true",
				exclude_ids: formStatements.map(s => s.id).join(","),
				start_date: defaultFilterStartDate ?? undefined,
				end_date: defaultFilterEndDate,
			}}
			isOpen={isAttachingStatement}
			setIsOpen={setIsAttachingStatement}
			handler={async statement => {
				if (form.getFieldValue("statements").some(s => s.id === statement.id)) {
					return
				}

				setStatementCache(prev =>
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
		<Dialog
			open={open}
			onOpenChangeComplete={onOpenChangeComplete}
			onOpenChange={isOpen => {
				setIsOpen(isOpen)
				if (isOpen) {
					form.reset()
					resetApiErrors()
				}
			}}
		>
			{trigger && <DialogTrigger render={trigger} />}
			{monthlyBudgets === undefined ? null : (
				<DialogContent className="md:max-w-4xl">
					<DialogHeader>
						<DialogTitle>Edit Record</DialogTitle>
						<DialogDescription>
							Update the record details and its statement allocations.
						</DialogDescription>
					</DialogHeader>

					<form
						id="record-editor-form"
						className="grid gap-8 lg:grid-cols-2"
						onSubmit={event => {
							event.preventDefault()
							void form.handleSubmit()
						}}
					>
						<div className="flex flex-col gap-4">
							<p className="text-sm font-semibold">Record Information</p>

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
											label="Date and time"
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
											{...COLLAPSE_MOTION}
										>
											<Alert className="mt-4 max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
												<IconifyIcon icon="lucide:triangle-alert" />
												<AlertTitle>
													Amount does not match the sum of Allocation
													Amounts
												</AlertTitle>
												<AlertDescription>
													This record will be marked as pending until the
													record amount matches the sum of allocated
													statement amounts.
												</AlertDescription>
											</Alert>
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

						<div className="flex flex-col gap-4">
							<div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<p className="text-sm font-semibold">Statement allocations</p>

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
													layout
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
														name={
															`statements[${index}].amount` as const
														}
													>
														{field => {
															// biome-ignore lint/style/noNonNullAssertion: All full statement objects must be cached
															const statement = statementCache.find(
																s => s.id === id,
															)!

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
																	: (field.state.value /
																			allocable) *
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
																			value={
																				field.state.value
																			}
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
																				"transition-colors",
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
					</form>

					<DialogFooter>
						<div className="flex min-w-0 flex-col gap-2 sm:mr-auto sm:flex-row sm:items-center">
							<Button type="button" variant="destructive" onClick={handleDelete}>
								<IconifyIcon icon="lucide:trash-2" /> Delete
							</Button>
							{submitError ? (
								<p
									className="fade-in animate-in text-xs text-destructive duration-150 ease-out"
									aria-live="polite"
								>
									{submitError}
								</p>
							) : null}
						</div>
						<DialogClose
							render={
								<Button type="button" variant="outline">
									Cancel
								</Button>
							}
						/>
						<Button type="button" onClick={() => void form.handleSubmit()}>
							Save changes
						</Button>
					</DialogFooter>
				</DialogContent>
			)}
		</Dialog>
	)
}
