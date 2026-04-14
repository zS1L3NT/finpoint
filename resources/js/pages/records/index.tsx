import { Paginated, Record } from "@/types"
import { formatCurrency } from "@/utils"

export default function RecordsIndex({ records }: { records: Paginated<Record> }) {
	return (
		<>
			<h1 className="mb-4">Records</h1>

			<table className="table table-hover">
				<thead>
					<tr>
						<th>Title</th>
						<th>Amount</th>
						<th>Date</th>
					</tr>
				</thead>

				<tbody>
					{records.data.map(record => (
						<tr key={record.id}>
							<td>
								<span>{record.title}</span>
								{record.people ? (
									<span>
										{" with "}
										<i>{record.people}</i>
									</span>
								) : null}
								{record.location ? (
									<span>
										{" @ "}
										<strong>{record.location}</strong>
									</span>
								) : null}
							</td>
							<td className={record.amount < 0 ? "text-danger" : "text-success"}>
								{formatCurrency(record.amount)}
							</td>
							<td>{record.date}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}
