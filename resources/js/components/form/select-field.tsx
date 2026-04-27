import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

type ErrorItem = { message?: string }

type Props = {
	id: string
	label: string
	value: string
	errors: ErrorItem[]
	placeholder?: string
	items: { value: string; label: string }[]
	onChange: (value: string) => void
}

export default function SelectField({
	id,
	label,
	value,
	errors,
	placeholder,
	items,
	onChange,
}: Props) {
	return (
		<Field data-invalid={!!errors.length}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className="w-full" id={id} aria-invalid={!!errors.length}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{items.map(item => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<FieldError errors={errors} />
		</Field>
	)
}
