import { useState } from "react"
import { toast } from "sonner"
import { getRecord } from "@/logic/records"
import type { Record, Statement } from "@/types"

export type EditableRecord = Record & { statements: Statement[] }

export function useRecordEditor() {
	const [editingRecord, setEditingRecord] = useState<EditableRecord | null>(null)
	const [loadingRecordId, setLoadingRecordId] = useState<string | null>(null)

	const editRecord = async (record: Record) => {
		if (loadingRecordId) return
		setLoadingRecordId(record.id)
		try {
			const data = await getRecord(record.id)
			setEditingRecord(data as unknown as EditableRecord)
		} catch {
			toast.error("Unable to open this Record for editing.")
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
