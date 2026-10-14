import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"
import { getRecord, type RecordDetail } from "@/logic/records"
import type { Record } from "@/types"

export function useRecordEditor() {
	const [editingRecord, setEditingRecord] = useState<RecordDetail | null>(null)
	const loadingRef = useRef<string | null>(null)

	const handleEdit = useCallback(async (record: Record) => {
		if (loadingRef.current) return
		loadingRef.current = record.id
		try {
			setEditingRecord(await getRecord(record.id))
		} catch {
			toast.error("Unable to open this Record for editing.")
		} finally {
			loadingRef.current = null
		}
	}, [])

	return {
		editingRecord,
		handleEdit,
		setEditingRecord,
	}
}
