import { Form } from "@inertiajs/react"
import React from "react"
import ImportController from "@/wayfinder/actions/App/Http/Controllers/ImportController"

export default function Import({ errors }: { errors: Record<string, string> }) {
	const fileErrors = Object.entries(errors)
		.filter(([k, v]) => k.startsWith("files"))
		.map(([k, v]) => v)

	return (
		<>
			<h1>Import Bank Statements</h1>

			<Form
				method="POST"
				encType="multipart/form-data"
				action={ImportController.store.url()}
				className="m-auto vstack gap-3"
			>
				<div className="col-12 mb-3">
					<label htmlFor="files[]">Files</label>
					<input
						type="file"
						multiple
						className={`form-control ${fileErrors.length ? "is-invalid" : ""}`}
						id="files[]"
						name="files[]"
					/>
					<div className="invalid-feedback">{fileErrors[0]}</div>
				</div>

				<button className="btn btn-primary" type="submit">
					Import
				</button>
			</Form>
		</>
	)
}
