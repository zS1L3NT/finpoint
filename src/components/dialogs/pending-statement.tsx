import { DateTime } from "luxon"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { PreviewSection } from "@/components/dialogs/item-preview"
import AmountField from "@/components/form/amount-field"
import DatetimeField from "@/components/form/datetime-field"
import SelectField from "@/components/form/select-field"
import TextareaField from "@/components/form/textarea-field"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
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
import { FieldGroup } from "@/components/ui/field"
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { useDialogCloseAnimation } from "@/hooks/use-dialog-close-animation"
import { useSubmitLock } from "@/hooks/use-submit-lock"
import { bankMeta } from "@/lib/banks"
import { cn } from "@/lib/utils"
import {
	createPendingStatement,
	deletePendingStatement,
	updatePendingStatement,
} from "@/logic/statements"
import { deleteFailureMessage, ValidationError } from "@/logic/validate"
import type { Account, Statement } from "@/types"

/** Creates a Pending Statement; an existing one is edited from its Statement preview. */
export default function PendingStatementDialog({
	accounts,
	isOpen,
	setIsOpen: onOpenChange,
	trigger,
}: {
	accounts: Account[]
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	trigger?: React.ReactElement
}) {
	const { open, setIsOpen, onOpenChangeComplete } = useDialogCloseAnimation(isOpen, onOpenChange)
	const { locked, run } = useSubmitLock(isOpen)

	return (
		<Dialog open={open} onOpenChangeComplete={onOpenChangeComplete} onOpenChange={setIsOpen}>
			{trigger ? <DialogTrigger render={trigger} /> : null}
			<DialogContent className="md:max-w-lg">
				<DialogHeader>
					<DialogTitle>Create Pending Statement</DialogTitle>
					<DialogDescription>
						Add handwritten account activity now and replace it when the imported
						Statement arrives.
					</DialogDescription>
				</DialogHeader>
				{/* Remounts per opening, so each one starts from a blank form. */}
				{isOpen ? (
					<PendingStatementForm
						accounts={accounts}
						locked={locked}
						run={run}
						onDone={() => setIsOpen(false)}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	)
}

/** The Pending Statement fields and actions: blank to create one, seeded to edit `statement`. */
export function PendingStatementForm({
	statement,
	accounts,
	locked,
	run,
	focusFirstField = false,
	onDone,
	onDeleted,
	aside,
}: {
	statement?: Statement
	accounts: Account[]
	locked: boolean
	run: (operation: () => Promise<boolean>) => Promise<void>
	/** Opened from the preview: the form takes focus from the Edit button it replaced. */
	focusFirstField?: boolean
	/** Saved or cancelled. */
	onDone: () => void
	onDeleted?: () => void
	/** Sits beside the fields on wide screens, where the preview shows it, so Edit keeps it in place. */
	aside?: React.ReactNode
}) {
	const [values, setValues] = useState(() =>
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
	// The first Delete click arms; the second deletes, as in the Record editor.
	const [armed, setArmed] = useState(false)
	const { getApiFieldErrors, clearApiError, setApiErrors } = useApiFormErrors()
	const formElement = useRef<HTMLFormElement>(null)
	useEffect(() => {
		// Fine pointers only: on touch screens a focused field would raise the keyboard unasked.
		if (focusFirstField && matchMedia("(pointer: fine)").matches) {
			formElement.current?.querySelector<HTMLElement>("button, input")?.focus()
		}
	}, [focusFirstField])

	// Accounts can arrive after a new Statement form opened.
	const defaultAccountId = accounts[0]?.id
	if (!statement && !values.account_id && defaultAccountId) {
		setValues(current => ({ ...current, account_id: defaultAccountId }))
	}

	const setValue = <TKey extends keyof typeof values>(
		field: TKey,
		value: (typeof values)[TKey],
	) => {
		setValues(current => ({ ...current, [field]: value }))
		clearApiError(field)
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		await run(async () => {
			try {
				if (statement) await updatePendingStatement(statement.id, values)
				else await createPendingStatement(values)
				onDone()
				return true
			} catch (cause) {
				if (cause instanceof ValidationError) setApiErrors(cause.errors)
				else toast.error("Unable to save this Statement.")
				return false
			}
		})
	}

	const handleDelete = async () => {
		if (!statement) return
		if (!armed) {
			setArmed(true)
			return
		}

		await run(async () => {
			try {
				await deletePendingStatement(statement.id)
				onDeleted?.()
				return true
			} catch (cause) {
				setArmed(false)
				toast.error(deleteFailureMessage(cause, "Unable to delete this Statement."))
				return false
			}
		})
	}

	// Phones end the form with Delete, as the Record editor does; wider screens keep it in the footer.
	const deletion = (className: string) =>
		statement ? (
			<div
				className={cn("flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center", className)}
			>
				<Button
					type="button"
					variant="destructive"
					disabled={locked || !statement.is_unallocated}
					onClick={() => void handleDelete()}
				>
					<IconifyIcon icon="lucide:trash-2" data-icon="inline-start" />
					{armed ? "Yes, delete Pending Statement" : "Delete"}
				</Button>
				{statement.is_unallocated ? null : (
					<p className="text-xs text-muted-foreground">
						Remove this Statement from its Records before deleting.
					</p>
				)}
			</div>
		) : null

	const fields = (
		<form
			id="pending-statement-form"
			ref={formElement}
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
						label: `${account.name} · ${bankMeta(account.bank).label}`,
					}))}
					onChange={value => setValue("account_id", value)}
				/>
				<DatetimeField
					id="datetime"
					value={values.datetime}
					errors={getApiFieldErrors("datetime")}
					onChange={value => setValue("datetime", value)}
				/>
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
			</FieldGroup>
		</form>
	)

	return (
		<>
			<DialogBody>
				<div
					className={cn(
						"grid gap-8",
						// From the preview, the form fades in where the preview did.
						aside && "fade-in animate-in duration-150 ease-out lg:grid-cols-2",
					)}
				>
					{aside ? (
						<PreviewSection title="Statement information">{fields}</PreviewSection>
					) : (
						fields
					)}
					{aside}
					{deletion("sm:hidden [&>button]:w-full")}
				</div>
			</DialogBody>

			<DialogFooter className="sm:items-center">
				{deletion("mr-auto max-sm:hidden")}
				<Button type="button" variant="outline" onClick={onDone}>
					Cancel
				</Button>
				<Button type="submit" form="pending-statement-form" disabled={locked}>
					{statement ? "Save changes" : "Create statement"}
				</Button>
			</DialogFooter>
		</>
	)
}
