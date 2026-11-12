import { useState } from "react"
import { toast } from "sonner"
import TextField from "@/components/form/text-field"
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
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { useDialogCloseAnimation } from "@/hooks/use-dialog-close-animation"
import { useSubmitLock } from "@/hooks/use-submit-lock"
import { updateAccount } from "@/logic/accounts"
import { ValidationError } from "@/logic/validate"
import type { Account } from "@/types"

export default function AccountDialog({
	account,
	isOpen,
	setIsOpen: onOpenChange,
	trigger,
}: {
	account: Account
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	trigger?: React.ReactElement
}) {
	const { open, setIsOpen, onOpenChangeComplete } = useDialogCloseAnimation(isOpen, onOpenChange)
	const [name, setName] = useState(account.name)
	const { getApiFieldErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const { locked, run } = useSubmitLock(isOpen)

	// Seed when the dialog opens, and again only for a different Account: a fresh object for
	// the same one (a background write) must not replace what is being typed.
	const seedKey = isOpen ? account.id : null
	const [seededKey, setSeededKey] = useState<string | null>(null)
	if (seedKey !== seededKey) {
		setSeededKey(seedKey)
		if (seedKey !== null) {
			setName(account.name)
			resetApiErrors()
		}
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		await run(async () => {
			try {
				await updateAccount(account.id, { name })
				setIsOpen(false)
				return true
			} catch (cause) {
				if (cause instanceof ValidationError) setApiErrors(cause.errors)
				else toast.error("Unable to save this account.")
				return false
			}
		})
	}

	return (
		<Dialog open={open} onOpenChangeComplete={onOpenChangeComplete} onOpenChange={setIsOpen}>
			{trigger ? <DialogTrigger render={trigger} /> : null}
			<DialogContent className="md:max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Account</DialogTitle>
					<DialogDescription>
						Update the account name shown across Finpoint.
					</DialogDescription>
				</DialogHeader>

				<form id="account-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<TextField
						id="name"
						label="Name"
						value={name}
						errors={getApiFieldErrors("name")}
						onChange={value => {
							setName(value)
							clearApiError("name")
						}}
					/>
				</form>

				<DialogFooter>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Cancel
							</Button>
						}
					/>
					<Button type="submit" form="account-form" disabled={locked}>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
