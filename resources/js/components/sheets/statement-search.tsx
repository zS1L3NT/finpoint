import { Icon as IconifyIcon } from "@iconify/react"
import { useEffect, useState } from "react"
import AllocateBar from "@/components/allocate-bar"
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
import { Statement } from "@/types"
import { statementIndexApiRoute } from "@/wayfinder/routes"

const ATTACHMENT_TABLE_WIDTHS = {
	ACCOUNT: "w-32",
	AMOUNT_BAR: "w-56",
	ACTIONS: "w-24",
}

export default function StatementSearchSheet({
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
	handler: (statement: Statement) => Promise<void>
	trigger?: React.ReactNode
}) {
	const [query, setQuery] = useState("")
	const [statements, setStatements] = useState<Statement[]>([])
	const [includeOlder, setIncludeOlder] = useState(false)

	const handleSearch = async () => {
		const response = await fetch(
			statementIndexApiRoute.url({
				query: {
					query,
					...filters,
					start_date: includeOlder ? undefined : filters?.start_date,
				},
			}),
			{ headers: { Accept: "application/json" } },
		)

		if (response.ok) {
			setStatements(await response.json())
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
						Choose a statement with an allocable amount to attach to the current record.
					</SheetDescription>
				</SheetHeader>

				<div className="flex flex-1 flex-col gap-4 overflow-y-hidden p-4 md:p-6">
					<Field>
						<FieldLabel htmlFor="statement-search-query">Search statements</FieldLabel>
						<div className="flex flex-col gap-2 sm:flex-row">
							<Input
								id="statement-search-query"
								type="search"
								placeholder={placeholder ?? "Search statements..."}
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
							data={statements}
							columns={[
								{
									header: "Account",
									meta: { width: ATTACHMENT_TABLE_WIDTHS.ACCOUNT },
									cell: ({ row }) => (
										<div className="flex flex-col gap-0.5">
											<span className="font-medium">
												{row.original.account.name}
											</span>
											<span className="text-muted-foreground">
												{row.original.account.bank}
											</span>
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
									header: "Allocable",
									meta: { width: ATTACHMENT_TABLE_WIDTHS.AMOUNT_BAR },
									cell: ({ row }) => (
										<AllocateBar
											title="Allocable"
											value={row.original.allocable_amount}
											total={row.original.amount}
										/>
									),
								},
								{
									header: "Description",
									cell: ({ row }) => (
										<div className="whitespace-pre-line break-words text-muted-foreground">
											{row.original.is_pending ? (
												<Badge variant="warning" className="mr-1">
													Pending
												</Badge>
											) : null}
											{row.original.description || "-"}
										</div>
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
							mobileRow={({ original: statement }) => (
								<div className="flex flex-col gap-3">
									<div className="flex flex-col gap-1">
										<p className="font-medium break-words">
											{statement.is_pending ? (
												<Badge variant="warning" className="mr-1">
													Pending
												</Badge>
											) : null}
											{statement.description}
										</p>
										<p className="text-xs text-muted-foreground">
											{statement.account.name} ·{" "}
											{formatDatetime(statement.datetime)}
										</p>
									</div>
									<AllocateBar
										title="Allocable"
										value={statement.allocable_amount}
										total={statement.amount}
									/>
									<Button
										size="sm"
										className="w-full"
										onClick={async () => {
											await handler(statement)
											await handleSearch()
										}}
									>
										<IconifyIcon
											icon="lucide:link-2"
											data-icon="inline-start"
										/>
										Attach statement
									</Button>
								</div>
							)}
							emptyMessage="No allocable statements found."
						/>
					</ScrollArea>
				</div>
			</SheetContent>
		</Sheet>
	)
}
