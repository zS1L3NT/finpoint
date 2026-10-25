import { useState } from "react"
import AmountField from "@/components/form/amount-field"
import ComboboxField from "@/components/form/combobox-field"
import DateField from "@/components/form/date-field"
import DateRange, { type DateRangeValue } from "@/components/form/date-range"
import DatetimeField from "@/components/form/datetime-field"
import RecordAnalyticsFields from "@/components/form/record-analytics-fields"
import SelectField from "@/components/form/select-field"
import TextField from "@/components/form/text-field"
import TextareaField from "@/components/form/textarea-field"
import { FieldGroup } from "@/components/ui/field"
import type { AnalyticsTreatment } from "@/types"

type Payee = { id: string; name: string }

const PAYEES: Payee[] = [
	{ id: "payee-makan", name: "Makan place" },
	{ id: "payee-groceries", name: "Groceries" },
	{ id: "payee-transport", name: "Transport" },
	{ id: "payee-descriptive", name: "Descriptive long payee name for wrapping" },
]

export function FormsSection() {
	const [amount, setAmount] = useState(12.5)
	const [cappedAmount, setCappedAmount] = useState(5)
	const [title, setTitle] = useState("")
	const [suggested, setSuggested] = useState("")
	const [notes, setNotes] = useState("")
	const [direction, setDirection] = useState("spending")
	const [payee, setPayee] = useState<Payee | null>(null)
	const [date, setDate] = useState("2026-09-14")
	const [disabledChanges, setDisabledChanges] = useState(0)
	const [range, setRange] = useState<DateRangeValue>({ start: "2026-09-01", end: "2026-09-30" })
	const [datetime, setDatetime] = useState("2026-09-14T09:30")
	const [treatment, setTreatment] = useState("")
	const [monthlyBudgetId, setMonthlyBudgetId] = useState("")
	const [monthlyBudgetSource, setMonthlyBudgetSource] = useState<"category" | "manual">("manual")
	const [categoryTreatment] = useState<AnalyticsTreatment>("spending")
	const [choice, setChoice] = useState("")

	return (
		<section
			aria-label="Form fields"
			data-testid="harness-forms"
			className="flex flex-col gap-6"
		>
			<h2 className="text-sm font-semibold">Forms</h2>
			<FieldGroup>
				<AmountField
					id="harness-amount"
					label="Amount"
					description="Two decimal places; ArrowUp and ArrowDown step by 0.01."
					value={amount}
					placeholder="0.00"
					onChange={setAmount}
				/>
				<p data-testid="amount-value">Amount value: {amount}</p>
				<AmountField
					id="harness-amount-non-negative"
					label="Amount non-negative"
					description="Minimum zero; sign toggle hidden."
					value={cappedAmount}
					min={0}
					max={100}
					onChange={setCappedAmount}
				/>
				<p data-testid="amount-capped-value">Capped value: {cappedAmount}</p>

				<TextField
					id="harness-title"
					label="Title"
					description="Plain text control."
					value={title}
					placeholder="e.g. Dinner"
					onChange={setTitle}
				/>
				<p data-testid="title-value">Title value: {title || "empty"}</p>
				<TextField
					id="harness-title-suggest"
					label="Title with suggestions"
					value={suggested}
					placeholder="Type to filter"
					suggestions={["Dinner", "Dessert", "Groceries"]}
					onChange={setSuggested}
				/>
				<p data-testid="suggested-value">Suggested value: {suggested || "empty"}</p>

				<TextareaField
					id="harness-notes"
					label="Notes"
					description="Long text stays inside the control."
					value={notes}
					placeholder="Optional notes"
					onChange={setNotes}
				/>
				<p data-testid="notes-value">Notes length: {notes.length}</p>

				<SelectField
					id="harness-direction"
					label="Direction"
					value={direction}
					placeholder="Choose direction"
					items={[
						{ value: "spending", label: "Spending" },
						{ value: "income", label: "Income" },
						{ value: "archived", label: "Archived", disabled: true },
					]}
					onChange={setDirection}
				/>
				<p data-testid="direction-value">Direction value: {direction}</p>

				<ComboboxField<Payee>
					id="harness-payee"
					label="Payee"
					value={payee}
					placeholder="Choose payee"
					emptyText="No payees found."
					items={PAYEES}
					getItemId={item => item.id}
					getItemString={item => item.name}
					renderItem={item => item.name}
					onChange={setPayee}
				/>
				<p data-testid="payee-value">Payee value: {payee ? payee.name : "none"}</p>

				<DateField
					id="harness-date"
					label="Date"
					value={date}
					placeholder="Select date"
					onChange={setDate}
				/>
				<p data-testid="date-value">Date value: {date || "empty"}</p>

				<DateRange
					id="harness-range"
					label="Date range"
					value={range}
					placeholder="Any date"
					onChange={setRange}
				/>
				<p data-testid="range-value">
					Range value: {range.start ?? "null"} to {range.end ?? "null"}
				</p>

				<DatetimeField
					id="harness-datetime"
					label="Date and time"
					value={datetime}
					placeholder="Select date and time"
					onChange={setDatetime}
				/>
				<p data-testid="datetime-value">Datetime value: {datetime || "empty"}</p>

				<RecordAnalyticsFields
					treatment={treatment}
					categoryTreatment={categoryTreatment}
					amount={amount}
					monthlyBudgetId={monthlyBudgetId}
					monthlyBudgetSource={monthlyBudgetSource}
					categoryMonthlyBudgetId={null}
					onTreatmentChange={setTreatment}
					onMonthlyBudgetChange={(value, source) => {
						setMonthlyBudgetId(value)
						setMonthlyBudgetSource(source)
					}}
				/>
				<p data-testid="analytics-value">
					Treatment: {treatment || "category-default"}; Monthly budget:{" "}
					{monthlyBudgetId || "unbudgeted"} ({monthlyBudgetSource})
				</p>

				<TextField
					id="harness-title-invalid"
					label="Title with error"
					value=""
					placeholder="Required"
					errors={[{ message: "Enter a title" }]}
					onChange={() => undefined}
				/>

				<SelectField
					id="harness-choice"
					label="Optional choice"
					value={choice}
					placeholder="Choose an option"
					items={[
						{ value: "short", label: "Short option" },
						{
							value: "long",
							label: "Sabbatical in Lisbon for the whole spring — a very long option label",
						},
					]}
					onChange={setChoice}
				/>
				<p data-testid="choice-value">Choice value: {choice || "none"}</p>

				<DateField
					id="harness-date-disabled"
					label="Disabled date"
					value="2026-09-14"
					placeholder="Select date"
					disabled
					onChange={() => setDisabledChanges(count => count + 1)}
				/>

				<ComboboxField<Payee>
					id="harness-payee-disabled"
					label="Disabled payee"
					value={null}
					placeholder="Choose payee"
					emptyText="No payees found."
					items={PAYEES}
					getItemId={item => item.id}
					getItemString={item => item.name}
					renderItem={item => item.name}
					disabled
					onChange={() => setDisabledChanges(count => count + 1)}
				/>

				<SelectField
					id="harness-direction-disabled"
					label="Disabled direction"
					value="spending"
					placeholder="Choose direction"
					items={[
						{ value: "spending", label: "Spending" },
						{ value: "income", label: "Income" },
					]}
					disabled
					onChange={() => setDisabledChanges(count => count + 1)}
				/>

				<DatetimeField
					id="harness-datetime-disabled"
					label="Disabled date and time"
					value="2026-09-14T09:30"
					placeholder="Select date and time"
					disabled
					onChange={() => setDisabledChanges(count => count + 1)}
				/>
				<p data-testid="disabled-changes">Disabled changes: {disabledChanges}</p>
			</FieldGroup>
		</section>
	)
}
