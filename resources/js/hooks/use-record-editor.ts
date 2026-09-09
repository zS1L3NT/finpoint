import { useState } from "react"
import { toast } from "sonner"
import type { Record, Statement } from "@/types"
import { recordShowApiRoute } from "@/wayfinder/routes"

export type EditableRecord = Record & { statements: Statement[] }

export function useRecordEditor() {
	const [editingRecord, setEditingRecord] = useState<EditableRecord | null>(null)
	const [loadingRecordId, setLoadingRecordId] = useState<string | null>(null)

	const editRecord = async (record: Record) => {
		if (loadingRecordId) return
		setLoadingRecordId(record.id)
		try {
			const response = await fetch(recordShowApiRoute.url({ record }), {
				headers: { Accept: "application/json" },
			})
			const data = await response.json().catch(() => null)
			if (response.ok) {
				setEditingRecord(data as EditableRecord)
				return
			}
			toast.error(data?.message ?? "Unable to open this Record for editing.")
		} finally {
			setLoadingRecordId(null)
		}
	}

	return {
		editingRecord,
		loadingRecordId,
		editRecord,
		setEditingRecord,
	}
}
