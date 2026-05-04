import { FormField, type FormFieldProps } from "@/components/form/field"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

type Props = FormFieldProps & {
	value: string
	placeholder?: string
	items: { value: string; label: string }[]
	onChange: (value: string) => void
}

export default function SelectField({ value, placeholder, items, onChange, ...props }: Props) {
	const { id, disabled, errors } = props

	return (
		<FormField {...props}>
			<Select value={value} onValueChange={onChange} disabled={disabled}>
				<SelectTrigger className="w-full" id={id} aria-invalid={!!errors?.length}>
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
		</FormField>
	)
}
