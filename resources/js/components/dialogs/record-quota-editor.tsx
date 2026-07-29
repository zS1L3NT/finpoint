import { router } from "@inertiajs/react"
import { useState } from "react"
import SelectField from "@/components/form/select-field"
import Icon from "@/components/icon"
import RecordAmount from "@/components/record-amount"
import { Badge } from "@/components/ui/badge"
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
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency, formatDatetime } from "@/lib/utils"
import { Quota, Record } from "@/types"
import { recordQuotaAttachApiRoute } from "@/wayfinder/routes"

export default function RecordQuotaDialog({
	records,
	quotas,
	clear,
	isOpen,
	setIsOpen,
	trigger,
}: {
	records: Record[]
	quotas: Quota[]
	clear: () => void
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	trigger?: React.ReactElement
}) {
	const [quotaId, setQuotaId] = useState("")
	const [error, setError] = useState("")
	const [submitting, setSubmitting] = useState(false)

	const quota = quotas.find(option => option.id === quotaId) ?? null

	const attach = async () => {
		if (!records.length) {
			return
		}

		if (!quota) {
			setError("Select a quota.")
			return
		}

		setSubmitting(true)
		setError("")

		try {
			const responses = await Promise.all(
				records.map(record =>
					fetch(recordQuotaAttachApiRoute({ record, quota }).url, {
						method: "POST",
						headers: { Accept: "application/json" },
					}),
				),
			)

			if (!responses.every(response => response.ok)) {
				setError("Unable to attach the selected records.")
				return
			}

			setIsOpen(false)
			clear()

			setTimeout(() => {
				router.reload()
			}, 300)
		} catch {
			setError("Unable to attach the selected records.")
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={isOpen => {
				setIsOpen(isOpen)
				if (isOpen) {
					setQuotaId("")
					setError("")
				}
			}}
		>
			{trigger && <DialogTrigger render={trigger} />}
			<DialogContent className="md:max-w-4xl">
				<DialogHeader>
					<DialogTitle>Attach Records to Quota</DialogTitle>
					<DialogDescription>
						Attach {records.length} selected record{records.length === 1 ? "" : "s"} to
						a quota.
					</DialogDescription>
				</DialogHeader>

				<form
					id="record-quota-form"
					className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]"
					onSubmit={event => {
						event.preventDefault()
						void attach()
					}}
				>
					<div className="flex flex-col gap-3">
						<p className="text-sm font-semibold">Destination</p>
						<FieldGroup>
							{quotas.length ? (
								<SelectField
									id="quota_id"
									label="Quota"
									value={quotaId}
									errors={error ? [{ message: error }] : []}
									placeholder="Select a quota"
									items={quotas.map(quota => ({
										value: quota.id,
										label: `${quota.name} ${quota.amount !== null ? `• ${formatCurrency(quota.amount)}` : "• No limit"}`,
									}))}
									onChange={value => {
										setQuotaId(value)
										setError("")
									}}
								/>
							) : (
								<p className="text-sm text-muted-foreground">
									No quotas are available for this dashboard view.
								</p>
							)}
						</FieldGroup>
						<p className="text-xs text-muted-foreground">
							Attaching replaces any current quota assignment for the selected
							records.
						</p>
					</div>

					<div className="flex min-w-0 flex-col gap-3">
						<div className="flex items-center justify-between gap-3">
							<p className="text-sm font-semibold">Selected records</p>
							<Badge variant="secondary">
								{records.length} record{records.length === 1 ? "" : "s"}
							</Badge>
						</div>
						<ScrollArea className="h-64 lg:h-80">
							<ItemGroup className="gap-2 pr-3">
								{records.map(record => (
									<Item
										key={record.id}
										variant="outline"
										className="items-center"
									>
										<ItemMedia variant="icon">
											<Icon {...record.category} size={14} />
										</ItemMedia>
										<ItemContent className="gap-0">
											<ItemTitle>
												{record.is_pending ? (
													<Badge variant="warning">Pending</Badge>
												) : null}
												{record.title}
											</ItemTitle>
											<ItemDescription>
												{formatDatetime(record.datetime)}
												{record.quota
													? ` • Current quota: ${record.quota.name}`
													: " • No quota"}
											</ItemDescription>
										</ItemContent>
										<ItemActions className="ml-auto">
											<RecordAmount record={record} />
										</ItemActions>
									</Item>
								))}
							</ItemGroup>
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
					<Button
						type="submit"
						form="record-quota-form"
						disabled={!records.length || !quotas.length || !quota || submitting}
					>
						{submitting
							? "Attaching..."
							: `Attach ${records.length} record${records.length === 1 ? "" : "s"}`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
