import { Form } from "@inertiajs/react"
import React, { useState } from "react"
import ImporterController from "@/wayfinder/actions/App/Http/Controllers/ImporterController"

export default function Importer(props: { errors: Record<string, string> }) {
	const [filled, setFilled] = useState(false)

	const errors = Object.entries(props.errors)
		.filter(([k, v]) => k.startsWith("files"))
		.map(([k, v]) => v)

	return (
		<Form
			method="POST"
			encType="multipart/form-data"
			action={ImporterController.store.url()}
			className="m-auto vstack gap-3"
		>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div>
					<h1>Importer</h1>
					<p className="text-body-secondary">Import bank statements from CSV files</p>
				</div>

				<button className="btn btn-primary" type="submit" disabled={!filled}>
					Import CSVs
				</button>
			</div>

			<div className="col-12 mb-3">
				<label htmlFor="files[]">Files</label>
				<input
					type="file"
					multiple
					className={`form-control ${errors.length ? "is-invalid" : ""}`}
					id="files[]"
					name="files[]"
					onChange={e => setFilled(!!e.target.files?.length)}
				/>
				<div className="invalid-feedback">{errors[0]}</div>
			</div>
		</Form>
	)
}
