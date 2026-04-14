import { router } from "@inertiajs/react"
import Icon from "@/components/icon"
import { Category, Paginated, Record, Statement } from "@/types"
import { formatCurrency, styleCurrency } from "@/utils"
import RecordController from "@/wayfinder/actions/App/Http/Controllers/RecordController"

type RecordExtra = {
	category: Category
	statements: Statement[]
}

export default function RecordsIndex({ records }: { records: Paginated<Record & RecordExtra> }) {
	const handleClick = (record: Record) => {
		router.visit(RecordController.show({ record: record.id }).url)
	}

	return (
		<>
			<h1 className="mb-4">Records</h1>

			<table className="table table-hover">
				<thead>
					<tr>
						<th style={{ width: 120 }}>Month</th>
						<th style={{ width: 120 }}>Date</th>
						<th style={{ width: 120 }}>Amount</th>
						<th>Title</th>
					</tr>
				</thead>

				<tbody>
					{Object.entries(
						Object.groupBy(records.data, record =>
							record.date.slice(0, "YYYY-MM".length),
						),
					)
						.toSorted(([a], [b]) => b.localeCompare(a))
						.map(([month, monthRecords]) =>
							Object.entries(
								Object.groupBy(monthRecords ?? [], record => record.date),
							)
								.toSorted(([a], [b]) => b.localeCompare(a))
								.map(([date, dateRecords], dateIndex) =>
									dateRecords?.map((record, recordIndex) => (
										<tr
											key={record.id}
											style={{ cursor: "pointer" }}
											onClick={() => handleClick(record)}
										>
											{dateIndex === 0 && recordIndex === 0 ? (
												<td rowSpan={monthRecords?.length ?? 0}>{month}</td>
											) : null}

											{recordIndex === 0 ? (
												<td rowSpan={dateRecords?.length ?? 0}>{date}</td>
											) : null}

											<td style={styleCurrency(record.amount)}>
												{formatCurrency(record.amount)}
											</td>

											<td className="d-flex align-items-center gap-2">
												<Icon {...record.category} />
												<p className="m-0">
													{record.title}
													{record.people ? ` with ${record.people}` : ""}
													{record.location ? ` @ ${record.location}` : ""}
												</p>
											</td>
										</tr>
									)),
								),
						)}
				</tbody>
			</table>
		</>
	)
}

function RecordEditor({ record }: { record: Record & RecordExtra }) {
	return (
		<div
			className="modal fade"
			id={`record-${record.id}-editor`}
			tabIndex={-1}
			aria-labelledby={`record-${record.id}-editor`}
			aria-hidden="true"
		>
			<div className="modal-dialog modal-dialog-centered modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id={`record-${record.id}-editor-label`}>
							Record Editor
						</h1>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body"></div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
