import { useEffect, useState } from "react"
import Icon from "@/components/icon"
import DataTable from "@/components/table/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import { classForCurrency, formatCurrency, formatDatetime } from "@/lib/utils"
import { Record } from "@/types"
import { recordIndexApiRoute } from "@/wayfinder/routes"

export default function RecordSearch({
	title,
	placeholder,
	filters,
	trigger,
	handler,
}: {
	title: string
	placeholder?: string
	filters?: { [key: string]: any }
	trigger: React.ReactNode
	handler: (record: Record, close: () => void) => Promise<void>
}) {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState("")
	const [records, setRecords] = useState<Record[]>([])

	useEffect(() => {
		if (!open) {
			setQuery("")
		} else {
			void handleSearch()
		}
	}, [open])

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
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>{trigger}</SheetTrigger>
			<SheetContent side="right" className="w-4xl">
				<SheetHeader className="gap-2 border-b">
					<SheetTitle>{title}</SheetTitle>
				</SheetHeader>

				<div className="flex flex-1 flex-col gap-4 overflow-y-hidden p-6">
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
												<span
													className={classForCurrency(
														row.original.amount,
													)}
												>
													{formatCurrency(row.original.amount)}
												</span>
											</div>
										</div>
									),
								},
								{
									id: "actions",
									meta: { width: TABLE_WIDTHS.ACTIONS_ATTACH },
									cell: ({ row }) => (
										<Button
											size="sm"
											onClick={async () => {
												await handler(row.original, () => setOpen(false))
												await handleSearch()
											}}
										>
											Attach
										</Button>
									),
								},
							]}
						/>
					</ScrollArea>
				</div>
			</SheetContent>
		</Sheet>
	)
}
