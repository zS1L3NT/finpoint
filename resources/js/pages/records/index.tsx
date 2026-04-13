import { Paginated, Record } from "@/types"

export default function RecordsIndex({ records }: { records: Paginated<Record> }) {
	return (
		<>
			<h1 className="mb-4">Records</h1>

			<table className="table table-hover">
				<thead>
					<tr>
						<th>Date</th>
						<th>Amount</th>
						<th>Description</th>
					</tr>
				</thead>

				<tbody>
					{records.data.map(record => (
						<tr key={record.id}>
							<td>{record.date}</td>
							<td>{record.amount}</td>
							<td>{record.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}
