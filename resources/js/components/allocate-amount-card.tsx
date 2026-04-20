import AmountField from "@/components/form/amount-field"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn, toCurrency, toDate } from "@/lib/utils"

type ErrorItem = { message?: string }

type Props = {
	fieldName?: string
	description: string
	date: string
	totalAmount: number
	allocableAmount: number
	value: number
	errors: ErrorItem[]
	onChange: (value: number) => void
}

export default function AllocationAmountCard({
	fieldName,
	description,
	date,
	totalAmount,
	allocableAmount,
	value,
	errors,
	onChange,
}: Props) {
	const progress =
		allocableAmount === 0 ? 0 : Math.max(0, Math.min((value / allocableAmount) * 100, 100))

	return (
		<Card className={cn(errors.length ? "border-destructive/50" : null)}>
			<CardHeader>
				<CardTitle className="max-w-100">{description}</CardTitle>
				<CardDescription>{toDate(date)}</CardDescription>
				<CardAction className="font-sm font-semibold">{toCurrency(totalAmount)}</CardAction>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<AmountField
					id={fieldName ?? "amount"}
					label="Amount"
					value={value}
					errors={errors}
					step={0.01}
					onChange={onChange}
				/>
				<Progress value={progress} />
			</CardContent>
		</Card>
	)
}
