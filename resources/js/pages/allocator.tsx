import { Link2Icon, LinkIcon, PlusIcon } from "lucide-react"
import { useState } from "react"
import DetailCard from "@/components/detail-card"
import RecordCreatorDialog from "@/components/dialogs/record-creator"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import DateField from "@/components/form/date-field"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import RecordSearchSheet from "@/components/sheets/record-search"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { useStatementColumns } from "@/components/table/statement-columns"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useFetch } from "@/hooks/use-fetch"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { useSearchParam } from "@/hooks/use-search-param"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { classForCurrency, formatCurrency } from "@/lib/utils"
import { CategoryWithChildren, Paginated, Record, Statement } from "@/types"
import { allocatorWebRoute, categoryIndexApiRoute, recordShowApiRoute } from "@/wayfinder/routes"

export default function AllocatorPage({ statements }: { statements: Paginated<Statement> }) {
	const [startDate, setStartDate] = useSearchParam("start_date")
	const [endDate, setEndDate] = useSearchParam("end_date")

	const categories = useFetch<CategoryWithChildren[]>(categoryIndexApiRoute.url(), [])

	const [selectedStatements, setSelectedStatements] = useState<Statement[]>([])
	const [isCreatingRecord, setIsCreatingRecord] = useState(false)
	const [isAttachingRecord, setIsAttachingRecord] = useState(false)
	const [editingRecord, setEditingRecord] = useState<
		(Record & { statements: Statement[] }) | null
	>(null)

	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query =>
			allocatorWebRoute({
				query: {
					...query,
					start_date: startDate || undefined,
					end_date: endDate || undefined,
				},
			}).url,
	})

	const selectedAmount = selectedStatements.reduce(
		(sum, statement) => sum + statement.allocable_amount,
		0,
	)
	const statementColumns = useStatementColumns<Statement>({
		amount: "allocable",
		pageName: "Allocator",
	})

	return (
		<>
			<AppHeader title="Allocator" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title="Allocator"
					subtitle="Allocate bank statements to app records."
					description="Allocation workspace"
					icon={LinkIcon}
				/>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<DetailCard label="Pending Statements" value={statements.total} />
					<DetailCard label="Selected Statements" value={selectedStatements.length} />
					<DetailCard
						label="Selected Amount"
						value={formatCurrency(selectedAmount)}
						valueClassName={classForCurrency(selectedAmount)}
					/>
				</div>

				<PaginatedDataTable
					paginated={statements}
					columns={[
						{
							id: "select",
							meta: { width: TABLE_WIDTH_CLASSNAMES.CHECKBOX },
							cell: ({ row }) => (
								<div className="flex items-center justify-center">
									<Checkbox
										checked={
											!!selectedStatements.find(s => s.id === row.original.id)
										}
										onCheckedChange={value =>
											setSelectedStatements(prev =>
												value
													? [...prev, row.original]
													: prev.filter(s => s.id !== row.original.id),
											)
										}
										aria-label={`Select statement ${row.original.id}`}
									/>
								</div>
							),
						},
						...statementColumns,
					]}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search unallocated statements...",
						filters: (
							<div className="flex gap-2">
								<DateField
									id="start_date"
									value={startDate ?? ""}
									className="w-32"
									placeholder="Start date"
									onChange={date => setStartDate(date || null)}
								/>

								<DateField
									id="end_date"
									value={endDate ?? ""}
									className="w-32"
									placeholder="End date"
									onChange={date => setEndDate(date || null)}
								/>
							</div>
						),
						actions: (
							<>
								<RecordCreatorDialog
									statements={selectedStatements}
									categories={categories}
									isOpen={isCreatingRecord}
									setIsOpen={setIsCreatingRecord}
									trigger={
										<Button disabled={!selectedStatements.length}>
											<PlusIcon /> Create Record
										</Button>
									}
									clear={() => setSelectedStatements([])}
								/>
								<RecordSearchSheet
									title="Attach to pending record"
									placeholder="Search pending records..."
									filters={{ is_allocated: "false" }}
									isOpen={isAttachingRecord}
									setIsOpen={setIsAttachingRecord}
									handler={async record => {
										setEditingRecord(
											await fetch(recordShowApiRoute.url({ record })).then(
												res => res.json(),
											),
										)
										setIsAttachingRecord(false)
									}}
									trigger={
										<Button disabled={!selectedStatements.length}>
											<Link2Icon /> Attach to Record
										</Button>
									}
								/>
							</>
						),
					}}
					footer={{
						summary: `${selectedStatements.length} selected. Showing ${statements.data.length} of ${statements.total} statements.`,
					}}
					selectedIds={selectedStatements.map(s => s.id)}
					emptyMessage="No statements found."
				/>
			</div>

			{editingRecord ? (
				<RecordEditorDialog
					record={editingRecord}
					statements={[
						...editingRecord.statements,
						...selectedStatements.filter(
							ss => !editingRecord.statements.find(es => es.id === ss.id),
						),
					]}
					categories={categories}
					isOpen={!!editingRecord}
					setIsOpen={isOpen => {
						if (!isOpen) {
							setEditingRecord(null)
							setSelectedStatements([])
						}
					}}
				/>
			) : null}
		</>
	)
}
