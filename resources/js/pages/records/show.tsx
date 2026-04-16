import { router } from "@inertiajs/react"
import { DateTime } from "luxon"
import React, { Fragment, useRef, useState } from "react"
import Icon from "@/components/icon"
import { Account, Allocation, Category, Record, Statement } from "@/types"
import { formatCurrency, styleCurrency } from "@/utils"
import RecordController from "@/wayfinder/actions/App/Http/Controllers/RecordController"
import StatementController from "@/wayfinder/actions/App/Http/Controllers/StatementController"

type RecordExtra = {
	category: Category & CategoryExtra
	statements: (Statement & { account: Account } & { pivot: Allocation })[]
}

type CategoryExtra = {
	children: Category[]
}

export default function RecordShow({
	record,
	categories,
}: {
	record: Record & RecordExtra
	categories: (Category & CategoryExtra)[]
}) {
	const handleClick = (statement: Statement) => {
		router.visit(StatementController.show({ statement: statement.id }).url)
	}

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1 className="m-0">Record {record.id}</h1>

				<button
					type="button"
					className="btn btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#record-editor"
				>
					Edit
				</button>
			</div>

			<div className="my-3">
				<div className="row">
					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">TITLE</p>
						<p className="fs-3">{record.title}</p>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">PEOPLE</p>
						<p className="fs-5">{record.people ?? "-"}</p>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">LOCATION</p>
						<p className="fs-5">{record.location ?? "-"}</p>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">AMOUNT</p>
						<p className="fs-3" style={styleCurrency(record.amount)}>
							{formatCurrency(record.amount)}
						</p>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">CATEGORY</p>
						<div className="d-flex align-items-center gap-2">
							<Icon {...record.category} size={16} />
							<p className="fs-5 m-0">{record.category.name}</p>
						</div>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">DATE & TIME</p>
						<p className="fs-5">
							{DateTime.fromFormat(record.datetime, "y-MM-dd T").toFormat(
								"d MMM y, h:mm a",
							)}
						</p>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">DESCRIPTION</p>
						<p className="fs-5">{record.description ?? "-"}</p>
					</div>
				</div>
			</div>

			<h3 className="mt-5 mb-4">Statements</h3>

			<table className="table table-hover" style={{ tableLayout: "fixed" }}>
				<thead>
					<tr>
						<th style={{ width: 125 }}>Account</th>
						<th style={{ width: 125 }}>Date</th>
						<th style={{ width: 125 }}>Statement ($)</th>
						<th style={{ width: 125 }}>Allocated ($)</th>
						<th>Description</th>
					</tr>
				</thead>

				<tbody>
					{record.statements.map(statement => (
						<tr
							key={statement.id}
							style={{ cursor: "pointer" }}
							onClick={() => handleClick(statement)}
						>
							<td>{statement.account.id}</td>
							<td>
								{DateTime.fromFormat(statement.date, "y-MM-dd").toFormat("d MMM y")}
							</td>
							<td style={styleCurrency(statement.amount)}>
								{formatCurrency(statement.amount)}
							</td>
							<td style={styleCurrency(statement.amount)}>
								{formatCurrency(statement.pivot.amount)}
							</td>
							<td
								title={statement.description}
								style={{
									textOverflow: "ellipsis",
									overflow: "hidden",
									whiteSpace: "nowrap",
								}}
							>
								{statement.description}
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<RecordEditor record={record} categories={categories} />
		</>
	)
}

function RecordEditor({
	record,
	categories,
}: {
	record: Record & RecordExtra
	categories: (Category & CategoryExtra)[]
}) {
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const [errors, setErrors] = useState<globalThis.Record<string, string[]>>({})

	const handleDelete = async () => {
		const formData = new FormData()
		formData.set("_method", "DELETE")

		await fetch(RecordController.destroy({ record: record.id }).url, {
			method: "post",
			body: formData,
			headers: { Accept: "application/json" },
		}).then(res => {
			if (res.status === 200) {
				closeButtonRef.current?.click()
				setTimeout(() => {
					router.visit(RecordController.index.url())
				}, 500)
			}
		})
	}

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		formData.set("_method", "PUT")

		await fetch(RecordController.update({ record: record.id }).url, {
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
		<form
			className="modal fade"
			id="record-editor"
			tabIndex={-1}
			aria-labelledby="record-editor"
			aria-hidden="true"
			onSubmit={handleSubmit}
		>
			<div className="modal-dialog modal-dialog-centered modal-xl">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id="record-editor-label">
							Record Editor
						</h1>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body">
						<div className="d-flex gap-4">
							<div style={{ width: 300 }}>
								<div className="mb-3">
									<label htmlFor="title" className="form-label">
										Title
									</label>
									<input
										type="text"
										className={`form-control ${errors.title?.length ? "is-invalid" : ""}`}
										name="title"
										id="title"
										defaultValue={record.title}
									/>
									<div className="invalid-feedback">
										{errors.title?.join("\n")}
									</div>
								</div>

								<div className="mb-3">
									<label htmlFor="people" className="form-label">
										People
									</label>
									<input
										type="text"
										className={`form-control ${errors.people?.length ? "is-invalid" : ""}`}
										name="people"
										id="people"
										defaultValue={record.people ?? ""}
									/>
									<div className="invalid-feedback">
										{errors.people?.join("\n")}
									</div>
								</div>

								<div className="mb-3">
									<label htmlFor="location" className="form-label">
										Location
									</label>
									<input
										type="text"
										className={`form-control ${errors.location?.length ? "is-invalid" : ""}`}
										name="location"
										id="location"
										defaultValue={record.location ?? ""}
									/>
									<div className="invalid-feedback">
										{errors.location?.join("\n")}
									</div>
								</div>

								<div className="mb-3">
									<label htmlFor="datetime" className="form-label">
										Date & Time
									</label>
									<input
										type="datetime-local"
										className="form-control"
										name="datetime"
										id="datetime"
										defaultValue={record.datetime}
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="category_id" className="form-label">
										Category
									</label>
									<select
										className={`form-select ${errors.category_id?.length ? "is-invalid" : ""}`}
										name="category_id"
										id="category_id"
										defaultValue={record.category.id}
									>
										{categories.map(category => (
											<optgroup key={category.id} label={category.name}>
												<option value={category.id}>{category.name}</option>
												{category.children?.map(category => (
													<option key={category.id} value={category.id}>
														{category.name}
													</option>
												))}
											</optgroup>
										))}
									</select>
									<div className="invalid-feedback">
										{errors.category_id?.join("\n")}
									</div>
								</div>

								<div className="mb-3">
									<label htmlFor="description" className="form-label">
										Description
									</label>
									<textarea
										className={`form-control ${errors.description?.length ? "is-invalid" : ""}`}
										name="description"
										id="description"
										rows={4}
										defaultValue={record.description ?? ""}
									/>
									<div className="invalid-feedback">
										{errors.description?.join("\n")}
									</div>
								</div>
							</div>

							<div className="vr"></div>

							<div className="flex-fill">
								{record.statements.map((statement, i) => (
									<Fragment key={statement.id}>
										{i !== 0 ? <hr /> : null}

										<input
											type="hidden"
											name={`statements[${i}][id]`}
											value={statement.id}
										/>

										<table className="table table-sm table-borderless">
											<tbody>
												<tr>
													<th style={{ width: 120 }}>Account</th>
													<td>
														{statement.account.name} (
														{statement.account.id})
													</td>
												</tr>
												<tr>
													<th>Description</th>
													<td>{statement.description}</td>
												</tr>
												<tr>
													<th>Date</th>
													<td>{statement.date}</td>
												</tr>
												<tr>
													<th className="align-middle">Allocated</th>
													<td>
														<div
															className="input-group"
															style={{ width: 400 }}
														>
															<span className="input-group-text">
																$
															</span>
															<input
																type="number"
																step={0.01}
																className={`form-control ${errors[`statements.${i}.amount`]?.length ? "is-invalid" : ""}`}
																name={`statements[${i}][amount]`}
																defaultValue={
																	statement.pivot.amount
																}
															/>
															<span className="input-group-text">
																out of{" "}
																{formatCurrency(statement.amount)}
															</span>
															<div className="invalid-feedback">
																{errors[
																	`statements.${i}.amount`
																]?.join("\n")}
															</div>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</Fragment>
								))}
							</div>
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
	)
}
