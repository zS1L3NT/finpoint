import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"
import { getRecord } from "@/logic/records"
import type { Record, Statement } from "@/types"

export type EditableRecord = Record & { statements: Statement[] }

export function useRecordEditor() {
	const [editingRecord, setEditingRecord] = useState<EditableRecord | null>(null)
	const loadingRef = useRef<string | null>(null)

	const editRecord = useCallback(async (record: Record) => {
		if (loadingRef.current) return
		loadingRef.current = record.id
		try {
			const data = await getRecord(record.id)
			setEditingRecord(data as unknown as EditableRecord)
		} catch {
			toast.error("Unable to open this Record for editing.")
		} finally {
			loadingRef.current = null
		}
	}, [])

	const handleEdit = useCallback(
		(record: Record) => {
			void editRecord(record)
		},
		[editRecord],
	)

	return {
		editingRecord,
		editRecord,
		handleEdit,
		setEditingRecord,
	}
}
