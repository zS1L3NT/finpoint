import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import AmountField from "@/components/form/amount-field"
import DatetimeField from "@/components/form/datetime-field"
import SelectField from "@/components/form/select-field"
import TextareaField from "@/components/form/textarea-field"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
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
import { FieldGroup } from "@/components/ui/field"
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { useDialogCloseAnimation } from "@/hooks/use-dialog-close-animation"
import {
	createPendingStatement,
	deletePendingStatement,
	updatePendingStatement,
} from "@/logic/statements"
import { ValidationError } from "@/logic/validate"
import { pathStatements } from "@/routes"
import type { Account, Statement } from "@/types"

type PendingStatementValues = {
	account_id: string
	datetime: string
	amount: number
	description: string
}

export default function PendingStatementDialog({
	statement,
	accounts,
	isOpen,
	setIsOpen: onOpenChange,
	trigger,
}: {
	statement?: Statement
	accounts: Account[]
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	trigger?: React.ReactElement
}) {
	const { open, setIsOpen, onOpenChangeComplete } = useDialogCloseAnimation(isOpen, onOpenChange)
	const router = useRouter()
	const isEditing = !!statement
	const [values, setValues] = useState<PendingStatementValues>({
		account_id: "",
		datetime: "",
		amount: 0,
		description: "",
	})
	const { getApiFieldErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	useEffect(() => {
		if (!isOpen) {
			return
		}

		setValues(
			statement
				? {
						account_id: statement.account.id,
						datetime: statement.datetime.replace(" ", "T"),
						amount: statement.amount,
						description: statement.description,
					}
				: {
						account_id: accounts[0]?.id ?? "",
						datetime: DateTime.now().startOf("day").toFormat("yyyy-MM-dd'T'HH:mm"),
						amount: 0,
						description: "",
					},
		)
		resetApiErrors()
	}, [accounts, isOpen, resetApiErrors, statement])

	const setValue = <TKey extends keyof PendingStatementValues>(
		field: TKey,
		value: PendingStatementValues[TKey],
	) => {
		setValues(current => ({ ...current, [field]: value }))
		clearApiError(field)
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		try {
			if (statement) {
				await updatePendingStatement(statement.id, {
					account_id: values.account_id,
					datetime: values.datetime,
					amount: values.amount,
					description: values.description,
				})
			} else {
				await createPendingStatement({
					account_id: values.account_id,
					datetime: values.datetime,
					amount: values.amount,
					description: values.description,
				})
			}
			setIsOpen(false)
			toast.success(isEditing ? "Pending statement updated." : "Pending statement created.")
		} catch (cause) {
			if (cause instanceof ValidationError) {
				setApiErrors(cause.errors)
				return
			}
			toast.error("Unable to save this statement.")
		}
	}

	const handleDelete = async () => {
		if (!statement) {
			return
		}

		try {
			await deletePendingStatement(statement.id)
			setIsOpen(false)
			toast.success("Pending statement deleted.")
			void router.push(pathStatements())
		} catch (cause) {
			if (cause instanceof ValidationError) {
				setApiErrors(cause.errors)
				return
			}
			toast.error("Unable to delete this statement.")
		}
	}

	return (
		<Dialog open={open} onOpenChangeComplete={onOpenChangeComplete} onOpenChange={setIsOpen}>
			{trigger ? <DialogTrigger render={trigger} /> : null}
			<DialogContent className="md:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Pending Statement" : "Create Pending Statement"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the handwritten statement details. Existing allocations remain unchanged."
							: "Add handwritten account activity now and replace it when the imported statement arrives."}
					</DialogDescription>
				</DialogHeader>

				<form
					id="pending-statement-form"
					className="flex flex-col gap-4"
					onSubmit={handleSubmit}
				>
					<FieldGroup>
						<SelectField
							id="account_id"
							label="Account"
							value={values.account_id}
							errors={getApiFieldErrors("account_id")}
							placeholder="Select an account"
							items={accounts.map(account => ({
								value: account.id,
								label: `${account.name} · ${account.bank}`,
							}))}
							onChange={value => setValue("account_id", value)}
						/>
						<DatetimeField
							id="datetime"
							label="Date & Time"
							value={values.datetime}
							errors={getApiFieldErrors("datetime")}
							onChange={value => setValue("datetime", value)}
						/>
					</FieldGroup>

					<AmountField
						id="amount"
						label="Amount"
						value={values.amount}
						errors={getApiFieldErrors("amount")}
						onChange={value => setValue("amount", value)}
					/>

					<TextareaField
						id="description"
						label="Description"
						value={values.description}
						errors={getApiFieldErrors("description")}
						placeholder="Describe the pending account activity"
						onChange={value => setValue("description", value)}
					/>
				</form>

				<DialogFooter className={isEditing ? "sm:justify-between" : undefined}>
					{isEditing ? (
						<Button
							type="button"
							variant="destructive"
							disabled={!statement.is_unallocated}
							title={
								statement.is_unallocated
									? "Delete pending statement"
									: "Remove every allocation before deleting"
							}
							onClick={() => void handleDelete()}
						>
							<IconifyIcon icon="lucide:trash-2" /> Delete
						</Button>
					) : null}
					<div className="flex flex-col-reverse gap-2 sm:flex-row">
						<DialogClose
							render={
								<Button type="button" variant="outline">
									Cancel
								</Button>
							}
						/>
						<Button type="submit" form="pending-statement-form">
							{isEditing ? "Save changes" : "Create statement"}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
