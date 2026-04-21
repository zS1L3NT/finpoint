import { router } from "@inertiajs/react"
import { TrashIcon } from "lucide-react"
import { DateTime } from "luxon"
import { useRef, useState } from "react"
import Icon from "@/components/icon"
import RecordSearch from "@/components/record-search"
import { Category, Record, Recurrence } from "@/types"
import { formatCurrency, styleCurrency } from "@/utils"
import ApiRecurrenceController from "@/wayfinder/actions/App/Http/Controllers/Api/RecurrenceController"
import ApiRecurrenceRecordController from "@/wayfinder/actions/App/Http/Controllers/Api/RecurrenceRecordController"
import WebRecordController from "@/wayfinder/actions/App/Http/Controllers/RecordController"
import WebRecurrenceController from "@/wayfinder/actions/App/Http/Controllers/RecurrenceController"

type RecurrenceExtra = {
	records: (Record & RecordExtra)[]
}

type RecordExtra = {
	category: Category
}

export default function RecurrenceShow({
	recurrence,
}: {
	recurrence: Recurrence & RecurrenceExtra
}) {
	const handleClick = (record: Record) => {
		router.visit(WebRecordController.show({ record: record.id }).url)
	}

	const handleAttachRecord = async (record: Record) => {
		const formData = new FormData()
		formData.set("_method", "PUT")

		await fetch(
			ApiRecurrenceRecordController.update({ recurrence: recurrence.id, record: record.id })
				.url,
			{
				method: "POST",
				body: formData,
				headers: { Accept: "application/json" },
			},
		).then(res => {
			if (res.status === 200) {
				router.reload()
			}
		})
	}

	const handleDetachRecord = async (record: Record) => {
		const formData = new FormData()
		formData.set("_method", "DELETE")

		await fetch(
			ApiRecurrenceRecordController.destroy({ recurrence: recurrence.id, record: record.id })
				.url,
			{
				method: "POST",
				body: formData,
				headers: { Accept: "application/json" },
			},
		).then(res => {
			if (res.status === 200) {
				router.reload()
			}
		})
	}

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1 className="m-0">Recurrence {recurrence.id}</h1>

				<button
					type="button"
					className="btn btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#recurrence-editor"
				>
					Edit
				</button>
			</div>

			<div className="my-3">
				<div className="row">
					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">NAME</p>
						<p className="fs-3">{recurrence.name}</p>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">AMOUNT</p>
						<p className="fs-3">${recurrence.amount.toFixed(2)}</p>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">PERIOD</p>
						<p className="fs-5">
							{recurrence.period[0].toUpperCase() + recurrence.period.slice(1)}ly
						</p>
					</div>
				</div>
			</div>

			<div className="d-flex justify-content-between align-items-center mt-5 mb-4">
				<h3 className="m-0">Records</h3>

				<button
					className="btn btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#record-search"
				>
					Add Record to Recurrence
				</button>
			</div>

			<table className="table table-hover" style={{ tableLayout: "fixed" }}>
				<thead>
					<tr>
						<th style={{ width: 200 }}>Date & Time</th>
						<th style={{ width: 125 }}>Amount ($)</th>
						<th>Title</th>
					</tr>
				</thead>

				<tbody>
					{recurrence.records.map(record => (
						<tr
							key={record.id}
							style={{ cursor: "pointer" }}
							onClick={() => handleClick(record)}
						>
							<td className="align-middle">
								{DateTime.fromFormat(record.datetime, "y-MM-dd T")
									.toFormat("d MMM y, h:mm a")
									.replace("12:00 AM", "-")}
							</td>
							<td className="align-middle" style={styleCurrency(record.amount)}>
								{formatCurrency(record.amount)}
							</td>
							<td className="d-flex align-items-center gap-2">
								<Icon {...record.category} />
								<p className="m-0" style={{ flex: 1 }}>
									{record.title}
									{record.people ? ` w/ ${record.people}` : ""}
									{record.location ? ` @ ${record.location}` : ""}
								</p>

								<button
									type="button"
									className="btn btn-danger ms-auto"
									onClick={async e => {
										e.stopPropagation()

										await handleDetachRecord(record)
									}}
								>
									<TrashIcon />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<RecordSearch
				filter={record => !recurrence.records.find(r => r.id === record.id)}
				handler={async (record, close) => {
					await handleAttachRecord(record)
					close()
				}}
			/>

			<RecurrenceEditor recurrence={recurrence} />
		</>
	)
}

function RecurrenceEditor({ recurrence }: { recurrence: Recurrence }) {
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const [errors, setErrors] = useState<globalThis.Record<string, string[]>>({})

	const handleDelete = async () => {
		const formData = new FormData()
		formData.set("_method", "DELETE")

		await fetch(ApiRecurrenceController.destroy({ recurrence: recurrence.id }).url, {
			method: "post",
			body: formData,
			headers: { Accept: "application/json" },
		}).then(res => {
			if (res.status === 200) {
				closeButtonRef.current?.click()
				router.visit(WebRecurrenceController.index.url())
			}
		})
	}

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		formData.set("_method", "PUT")

		await fetch(ApiRecurrenceController.update({ recurrence: recurrence.id }).url, {
			method: "post",
			body: formData,
			headers: { Accept: "application/json" },
		})
			.then(async res => [res, await res.json()] as const)
			.then(([res, data]) => {
				if (res.status === 422) {
					setErrors(data.errors)
				}

				if (res.status === 200) {
					closeButtonRef.current?.click()
					router.reload()
				}
			})
	}

	return (
		<>
			<form
				className="modal fade"
				id="recurrence-editor"
				tabIndex={-1}
				aria-labelledby="recurrence-editor-label"
				aria-hidden="true"
				onSubmit={handleSubmit}
			>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="recurrence-editor">
								Recurrence Editor
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							<div className="mb-3">
								<label htmlFor="name" className="form-label">
									Name
								</label>
								<input
									type="text"
									className={`form-control ${errors.name?.length ? "is-invalid" : ""}`}
									name="name"
									id="name"
									defaultValue={recurrence.name}
								/>
								<div className="invalid-feedback">{errors.name?.join("\n")}</div>
							</div>

							<div className="mb-3">
								<label htmlFor="amount" className="form-label">
									Amount ($)
								</label>
								<input
									type="number"
									className={`form-control ${errors.amount?.length ? "is-invalid" : ""}`}
									name="amount"
									id="amount"
									step={0.01}
									defaultValue={recurrence.amount}
								/>
								<div className="invalid-feedback">{errors.amount?.join("\n")}</div>
							</div>

							<div className="mb-3">
								<label htmlFor="period" className="form-label">
									Period
								</label>
								<select
									className={`form-select ${errors.period?.length ? "is-invalid" : ""}`}
									name="period"
									id="period"
									defaultValue={recurrence.period}
								>
									<option value="month">Monthly</option>
									<option value="year">Yearly</option>
								</select>
								<div className="invalid-feedback">{errors.period?.join("\n")}</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-danger me-auto"
								onClick={handleDelete}
							>
								Delete
							</button>
							<button
								ref={closeButtonRef}
								type="button"
								className="btn btn-secondary"
								data-bs-dismiss="modal"
							>
								Close
							</button>
							<button type="submit" className="btn btn-primary">
								Save
							</button>
						</div>
					</div>
				</div>
			</form>
		</>
	)
}
