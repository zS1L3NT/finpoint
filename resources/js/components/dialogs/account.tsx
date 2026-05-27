import { router } from "@inertiajs/react"
import { useEffect, useState } from "react"
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
import { withMethod } from "@/lib/utils"
import type { Account } from "@/types"
import { accountUpdateApiRoute } from "@/wayfinder/routes"

export default function AccountDialog({
	account,
	isOpen,
	setIsOpen,
	trigger,
}: {
	account: Account
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	trigger?: React.ReactElement
}) {
	const [name, setName] = useState(account.name)
	const { getApiFieldErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	useEffect(() => {
		if (isOpen) {
			setName(account.name)
			resetApiErrors()
		}
	}, [account, isOpen, resetApiErrors])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData()
		formData.append("name", name)

		const response = await fetch(accountUpdateApiRoute.url({ account }), {
			method: "POST",
			body: withMethod(formData, "PUT"),
			headers: { Accept: "application/json" },
		})

		if (response.status === 422) {
			const data = await response.json().catch(() => null)
			setApiErrors((data?.errors ?? {}) as Record<string, string[]>)
			return
		}

		if (response.ok) {
			setIsOpen(false)
			router.reload()
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{trigger ? <DialogTrigger render={trigger} /> : null}
			<DialogContent className="sm:max-w-md">
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
					<Button type="submit" form="account-form">
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
