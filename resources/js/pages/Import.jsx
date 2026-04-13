import React from "react"
import { Form } from "@inertiajs/react"
import Layout from "./Layout"

export default function Import({ errors }) {
    return (
        <Layout title="Import Bank Statements">
            <h1>Import Bank Statements</h1>

            <Form method="POST" encType="multipart/form-data" action={route("import.store")} className="m-auto vstack gap-3">
                <div className="col-12 mb-3">
                    <label htmlFor="files[]">Files</label>
                    <input type="file" multiple className={`form-control ${errors.files ? "is-invalid" : ""}`} id="files[]" name="files[]" />
                    <div className="invalid-feedback">
                        {errors.files}
                    </div>
                </div>

                <button className="btn btn-primary" type="submit">Import</button>
            </Form>
        </Layout >
    )
}