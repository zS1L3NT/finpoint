import React from "react"
import { Form } from "@inertiajs/react"
import Layout from "./Layout"

export default function Import({ errors }) {
    const fileErrors = Object.entries(errors).filter(([k, v]) => k.startsWith("files")).map(([k, v]) => v)

    return (
        <Layout title="Import Bank Statements">
            <h1>Import Bank Statements</h1>

            <Form method="POST" encType="multipart/form-data" action={route("import.store")} className="m-auto vstack gap-3">
                <div className="col-12 mb-3">
                    <label htmlFor="files[]">Files</label>
                    <input type="file" multiple className={`form-control ${fileErrors.length ? "is-invalid" : ""}`} id="files[]" name="files[]" />
                    <div className="invalid-feedback">
                        {fileErrors[0]}
                    </div>
                </div>

                <button className="btn btn-primary" type="submit">Import</button>
            </Form>
        </Layout >
    )
}