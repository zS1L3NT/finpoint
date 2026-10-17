import { useForm, useStore } from "@tanstack/react-form"
import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { toast } from "sonner"
import AmountField from "@/components/form/amount-field"
import ComboboxField from "@/components/form/combobox-field"
import DatetimeField from "@/components/form/datetime-field"
import RecordAnalyticsFields from "@/components/form/record-analytics-fields"
import TextField from "@/components/form/text-field"
import TextareaField from "@/components/form/textarea-field"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { FieldGroup } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { COLLAPSE_MOTION, SPRING, TRANSITION } from "@/lib/motion"
import { cn, formatCurrency, formatDatetime, pluralize, round2 } from "@/lib/utils"
import { listMonthlyBudgets } from "@/logic/monthly-budgets"
import { inferRecordDatetime } from "@/logic/record-defaults"
import { createRecord, recordCompletions } from "@/logic/records"
import { ValidationError } from "@/logic/validate"
import type { CategoryWithChildren, Statement } from "@/types"

export default function RecordCreatorDialog({
	statements: statementsProp,
	categories,
	clear,
	isOpen,
	setIsOpen,
	trigger,
}: {
	statements: Statement[]
	categories: CategoryWithChildren[]
	clear?: () => void
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	trigger?: React.ReactElement
}) {
	// Parents clear the selection right after a successful create; keep the last open list so
	// the attached statements don't vanish while the dialog fades out.
	const [openStatements, setOpenStatements] = useState(statementsProp)
	if (isOpen && openStatements !== statementsProp) setOpenStatements(statementsProp)
	const statements = isOpen ? statementsProp : openStatements

	const completions = useLiveQuery(() => recordCompletions(), []) ?? {
		titles: [],
		locations: [],
		peoples: [],
	}
	// Resolve the Monthly Budget lookup before the popup mounts so the
	// Analytics select keeps its laid-out label from the first frame.
	const monthlyBudgets = useLiveQuery(() => listMonthlyBudgets(), [])

	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const categoriesFlat = categories.flatMap(category => [category, ...category.children])

	const form = useForm({
		defaultValues: {
			title: "",
			people: "",
			location: "",
			datetime: inferRecordDatetime(statements),
			amount: round2(
				statements.reduce((acc, statement) => acc + statement.allocable_amount, 0),
			),
			category_id: "",
			analytics_treatment: "",
			monthly_budget_id: "",
			monthly_budget_source: "category" as "category" | "manual",
			description: "",
			statements: statements.map(statement => ({
				id: statement.id,
				amount: round2(statement.allocable_amount),
			})),
		},
		onSubmit: async ({ value }) => {
			try {
				await createRecord({
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
					statements: value.statements,
				})
				setIsOpen(false)
				clear?.()
			} catch (cause) {
				if (cause instanceof ValidationError) {
					setApiErrors(cause.errors)
					return
				}
				toast.error("Unable to create this record.")
			}
		},
	})

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

	return (
		<Dialog
			open={isOpen}
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
						<DialogTitle>Create New Record</DialogTitle>
						<DialogDescription>
							Allocate {pluralize(statements.length, "statement")} to a new record.
						</DialogDescription>
					</DialogHeader>

					<form
						id="allocate-record-form"
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
											autopopulated={
												!!statements.length &&
												!!field.state.value &&
												!field.state.meta.isDirty
													? "Autopopulated from statement dates or descriptions. Check before saving."
													: undefined
											}
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
											autopopulated={
												statements.length && !field.state.meta.isDirty
													? "Autopopulated from the available statement amounts."
													: undefined
											}
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
										<ComboboxField
											id={field.name}
											label="Category"
											value={
												categoriesFlat.find(
													category => category.id === field.state.value,
												) ?? null
											}
											errors={mergeErrors(
												field.state.meta.errors,
												field.name,
											)}
											placeholder="Select category"
											emptyText="No categories found."
											items={categoriesFlat}
											getItemId={category => category.id}
											getItemString={category => category.name}
											renderItem={category => (
												<div
													className={cn(
														"flex items-center gap-1",
														category.parent_category_id ? "pl-2" : null,
													)}
												>
													<Icon {...category} size={10} />
													{category.name}
												</div>
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
							<p className="text-sm font-semibold">Statement allocations</p>

							<ScrollArea className="h-fit max-h-200">
								<div className="relative flex flex-col gap-2">
									<AnimatePresence initial={false} mode="popLayout">
										{statements.map((statement, index) => (
											<motion.div
												key={statement.id}
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
													name={`statements[${index}].amount` as const}
												>
													{field => {
														const errors = mergeErrors(
															field.state.meta.errors,
															field.name,
														)
														const allocable = statement.allocable_amount

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
																		{formatDatetime(
																			statement.datetime,
																		)}
																	</CardDescription>
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

								<AnimatePresence initial={false}>
									{!statements.length && (
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
											</Empty>
										</motion.div>
									)}
								</AnimatePresence>
							</ScrollArea>
						</div>
					</form>

					<DialogFooter>
						<DialogClose
							render={
								<Button type="button" variant="outline">
									Cancel
								</Button>
							}
						/>
						<Button type="submit" form="allocate-record-form">
							Create Record
						</Button>
					</DialogFooter>
				</DialogContent>
			)}
		</Dialog>
	)
}
