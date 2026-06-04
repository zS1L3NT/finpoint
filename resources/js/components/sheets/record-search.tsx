import { useEffect, useState } from "react"
import Icon from "@/components/icon"
import RecordAmount from "@/components/record-amount"
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

export default function RecordSearchSheet({
	title,
	placeholder,
	filters,
	isOpen,
	setIsOpen,
	trigger,
	handler,
}: {
	title: string
	placeholder?: string
	filters?: { [key: string]: any }
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	handler: (record: Record) => Promise<void>
	trigger?: React.ReactNode
}) {
	const [query, setQuery] = useState("")
	const [records, setRecords] = useState<Record[]>([])

	useEffect(() => {
		if (!isOpen) {
			setQuery("")
		} else {
			void handleSearch()
		}
	}, [isOpen])

	useEffect(() => {
		void handleSearch()
	}, [query])

	const handleSearch = async () => {
		const response = await fetch(recordIndexApiRoute.url({ query: { query, ...filters } }), {
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			setRecords(await response.json())
		}
	}

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
			<SheetContent side="right" className="md:w-full md:max-w-4xl">
				<SheetHeader className="gap-2 border-b">
					<SheetTitle>{title}</SheetTitle>
					<SheetDescription className="sr-only">
						Search records and attach one from the results.
					</SheetDescription>
				</SheetHeader>

				<div className="flex flex-1 flex-col gap-4 overflow-y-hidden p-4 md:p-6">
					<Field>
						<FieldLabel htmlFor="record-search-query">Search records</FieldLabel>
						<Input
							id="record-search-query"
							type="search"
							placeholder={placeholder ?? "Search records..."}
							value={query}
							onChange={event => setQuery(event.target.value)}
						/>
					</Field>

					<ScrollArea className="flex-1 overflow-y-hidden">
						<DataTable
							data={records}
							columns={[
								{
									header: "Record",
									cell: ({ row }) => (
										<div className="flex items-center gap-2">
											<Icon {...row.original.category} size={20} />
											<div className="flex-1 truncate">
												<div className="truncate">
													<span className="font-medium">
														{row.original.is_pending && (
															<Badge
																variant="warning"
																className="mr-1"
															>
																Pending
															</Badge>
														)}
														{row.original.title}{" "}
													</span>
													<span className="text-muted-foreground">
														{row.original.subtitle}
													</span>
												</div>
												<div className="text-muted-foreground">
													{formatDatetime(row.original.datetime)}
												</div>
												<RecordAmount record={row.original} />
											</div>
										</div>
									),
								},
								{
									id: "actions",
									meta: { width: TABLE_WIDTH_CLASSNAMES.ACTIONS_FIXED_ATTACH },
									cell: ({ row }) => (
										<Button
											size="sm"
											onClick={async () => {
												await handler(row.original)
												await handleSearch()
											}}
										>
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
												{record.is_pending && (
													<Badge variant="warning" className="mr-1">
														Pending
													</Badge>
												)}
												{record.title}
											</p>
											<p className="text-xs text-muted-foreground">
												{formatDatetime(record.datetime)}
											</p>
										</div>
										<RecordAmount record={record} />
									</div>
									<div className="flex justify-end">
										<Button
											size="sm"
											onClick={async () => {
												await handler(record)
												await handleSearch()
											}}
										>
											Attach
										</Button>
									</div>
								</div>
							)}
						/>
					</ScrollArea>
				</div>
			</SheetContent>
		</Sheet>
	)
}
