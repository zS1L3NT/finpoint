import { router } from "@inertiajs/react"
import { Link2Icon } from "lucide-react"
import { useState } from "react"
import SelectField from "@/components/form/select-field"
import Icon from "@/components/icon"
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
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { classForCurrency, formatCurrency, formatDatetime } from "@/lib/utils"
import { Category, Quota, Record } from "@/types"
import { recordQuotaAttachApiRoute } from "@/wayfinder/routes"

type RecordExtra = {
	category: Category
	quota: Quota | null
}

export default function RecordQuotaDialog({
	records,
	quotas,
	clear,
}: {
	records: (Record & RecordExtra)[]
	quotas: Quota[]
	clear: () => void
}) {
	const [open, setOpen] = useState(false)
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

			setOpen(false)
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
			open={open}
			onOpenChange={nextOpen => {
				setOpen(nextOpen)
				if (nextOpen) {
					setQuotaId("")
					setError("")
				}
			}}
		>
			<DialogTrigger
				render={
					<Button disabled={!records.length}>
						<Link2Icon /> Attach to Quota
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Attach Records to Quota</DialogTitle>
					<DialogDescription>
						Attach {records.length} selected record{records.length === 1 ? "" : "s"} to
						a quota.
					</DialogDescription>
				</DialogHeader>

				<form
					id="record-quota-form"
					className="grid gap-6"
					onSubmit={event => {
						event.preventDefault()
						void attach()
					}}
				>
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

					<div className="space-y-2">
						<p className="text-sm font-semibold">Selected records</p>
						<ScrollArea className="h-72 pr-4">
							<div className="space-y-2">
								{records.map(record => (
									<Item key={record.id} variant="outline">
										<ItemMedia variant="icon">
											<Icon {...record.category} size={14} />
										</ItemMedia>
										<ItemContent>
											<ItemTitle>{record.title}</ItemTitle>
											<ItemDescription>
												{formatDatetime(record.datetime)}
												{record.quota
													? ` • Current quota: ${record.quota.name}`
													: " • No quota"}
											</ItemDescription>
										</ItemContent>
										<ItemActions className="ml-auto">
											<span className={classForCurrency(record.amount)}>
												{formatCurrency(record.amount)}
											</span>
										</ItemActions>
									</Item>
								))}
							</div>
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
