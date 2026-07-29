import { Icon as IconifyIcon } from "@iconify/react"
import { useEffect, useState } from "react"
import AllocateBar from "@/components/allocate-bar"
import Icon from "@/components/icon"
import DataTable from "@/components/table/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { formatDatetime } from "@/lib/utils"
import { Record } from "@/types"
import { recordIndexApiRoute } from "@/wayfinder/routes"

const ATTACHMENT_TABLE_WIDTHS = {
	AMOUNT_BAR: "w-56",
	ACTIONS: "w-24",
}

export default function RecordSearchSheet({
	title,
	placeholder,
	filters,
	isOpen,
	setIsOpen,
	handler,
	trigger,
}: {
	title: string
	placeholder?: string
	filters?: globalThis.Record<string, string | undefined>
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	handler: (record: Record) => Promise<void>
	trigger?: React.ReactNode
}) {
	const [query, setQuery] = useState("")
	const [records, setRecords] = useState<Record[]>([])
	const [includeOlder, setIncludeOlder] = useState(false)

	const handleSearch = async () => {
		const response = await fetch(
			recordIndexApiRoute.url({
				query: {
					query,
					...filters,
					start_date: includeOlder ? undefined : filters?.start_date,
				},
			}),
			{ headers: { Accept: "application/json" } },
		)

		if (response.ok) {
			setRecords(await response.json())
		}
	}

	useEffect(() => {
		if (!isOpen) {
			setQuery("")
			setIncludeOlder(false)
		}
	}, [isOpen])

	useEffect(() => {
		if (isOpen) {
			void handleSearch()
		}
	}, [isOpen, query, includeOlder])

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
			<SheetContent
				side="right"
				className="md:data-[side=right]:w-full md:data-[side=right]:max-w-4xl"
			>
				<SheetHeader className="gap-2 border-b">
					<SheetTitle>{title}</SheetTitle>
					<SheetDescription>
						Choose a record to attach. Allocation progress is shown for context.
					</SheetDescription>
				</SheetHeader>

				<div className="flex flex-1 flex-col gap-4 overflow-y-hidden p-4 md:p-6">
					<Field>
						<FieldLabel htmlFor="record-search-query">Search records</FieldLabel>
						<div className="flex flex-col gap-2 sm:flex-row">
							<Input
								id="record-search-query"
								type="search"
								placeholder={placeholder ?? "Search records..."}
								value={query}
								onChange={event => setQuery(event.target.value)}
							/>
							{filters?.start_date ? (
								<Button
									type="button"
									variant={includeOlder ? "secondary" : "outline"}
									aria-pressed={includeOlder}
									className="sm:shrink-0"
									onClick={() => setIncludeOlder(value => !value)}
								>
									<IconifyIcon icon="lucide:history" data-icon="inline-start" />
									Include older
								</Button>
							) : null}
						</div>
					</Field>

					<ScrollArea className="flex-1 overflow-y-hidden">
						<DataTable
							data={records}
							columns={[
								{
									header: "Record",
									cell: ({ row }) => (
										<div className="flex items-start gap-3">
											<Icon {...row.original.category} size={18} />
											<div className="min-w-0 flex-1">
												<p className="font-medium break-words">
													{row.original.is_pending ? (
														<Badge variant="warning" className="mr-1">
															Pending
														</Badge>
													) : null}
													{row.original.title}
												</p>
												<p className="text-muted-foreground break-words">
													{row.original.category.name}
													{row.original.subtitle
														? ` · ${row.original.subtitle}`
														: ""}
												</p>
											</div>
										</div>
									),
								},
								{
									header: "Date & Time",
									meta: { width: TABLE_WIDTH_CLASSNAMES.DATETIME },
									cell: ({ row }) => (
										<span className="text-muted-foreground">
											{formatDatetime(row.original.datetime)}
										</span>
									),
								},
								{
									header: "Allocation",
									meta: { width: ATTACHMENT_TABLE_WIDTHS.AMOUNT_BAR },
									cell: ({ row }) => (
										<AllocateBar
											title="Allocated"
											value={row.original.allocated_amount}
											total={row.original.amount}
										/>
									),
								},
								{
									id: "actions",
									meta: { width: ATTACHMENT_TABLE_WIDTHS.ACTIONS },
									cell: ({ row }) => (
										<Button
											size="sm"
											onClick={async () => {
												await handler(row.original)
												await handleSearch()
											}}
										>
											<IconifyIcon
												icon="lucide:link-2"
												data-icon="inline-start"
											/>
											Attach
										</Button>
									),
								},
							]}
							mobileRow={({ original: record }) => (
								<div className="flex flex-col gap-3">
									<div className="flex items-start gap-3">
										<Icon {...record.category} size={20} />
										<div className="min-w-0 flex-1">
											<p className="font-medium break-words">
												{record.is_pending ? (
													<Badge variant="warning" className="mr-1">
														Pending
													</Badge>
												) : null}
												{record.title}
											</p>
											<p className="text-xs text-muted-foreground">
												{record.category.name} ·{" "}
												{formatDatetime(record.datetime)}
											</p>
										</div>
									</div>
									{record.description ? (
										<p className="line-clamp-2 text-xs text-muted-foreground break-words">
											{record.description}
										</p>
									) : null}
									<AllocateBar
										title="Allocated"
										value={record.allocated_amount}
										total={record.amount}
									/>
									<Button
										size="sm"
										className="w-full"
										onClick={async () => {
											await handler(record)
											await handleSearch()
										}}
									>
										<IconifyIcon
											icon="lucide:link-2"
											data-icon="inline-start"
										/>
										Attach record
									</Button>
								</div>
							)}
							emptyMessage="No matching records found."
						/>
					</ScrollArea>
				</div>
			</SheetContent>
		</Sheet>
	)
}
