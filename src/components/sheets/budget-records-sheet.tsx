"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import DataTable from "@/components/table/data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { byDay } from "@/components/table/row-groups"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRecordEditor } from "@/hooks/use-record-editor"
import { listCategories } from "@/logic/categories"
import type { Record } from "@/types"

const byRecordDay = byDay<Record>("Record")

type Shown = { title: string; description: string; records: Record[] }

/**
 * The Budget's Records behind a clicked category or chart day, in the same sheet as the
 * Dashboard's drills. The page owns the URL state and passes the Records to show.
 */
export default function BudgetRecordsSheet({
	open,
	title,
	description,
	records,
	onClose,
}: Shown & {
	open: boolean
	onClose: () => void
}) {
	const router = useRouter()
	// Phones get a bottom sheet; wider screens keep the side sheet.
	const isMobile = useIsMobile()
	// A Record opens in its editor over the sheet, which stays open behind it.
	const { editingRecord, handleEdit, setEditingRecord } = useRecordEditor()
	const categories = useLiveQuery(() => listCategories(), [])
	const [content, setContent] = useState<HTMLDivElement | null>(null)
	const columns = useRecordColumns<Record>({ onOpen: handleEdit, grouped: true })
	const mobileRow = useRecordMobileRow<Record>({ onOpen: handleEdit, grouped: true })

	// Keep the last content while the sheet slides out, so it does not blank mid-exit.
	const [shown, setShown] = useState<Shown>({ title, description, records })
	if (
		open &&
		(shown.title !== title || shown.description !== description || shown.records !== records)
	)
		setShown({ title, description, records })

	// A sheet opened from the page pushed a history entry, so closing pops it; one that was
	// already open on load has nothing to pop and is closed in place.
	const opened = useRef(false)
	const wasOpen = useRef(open)
	useEffect(() => {
		opened.current = open && (opened.current || !wasOpen.current)
		wasOpen.current = open
	}, [open])
	const dismiss = () => (opened.current ? router.back() : onClose())

	return (
		<Sheet open={open} onOpenChange={isOpen => !isOpen && dismiss()}>
			<SheetContent
				ref={setContent}
				// Escape closes the Record editor first; the sheet stays open behind it.
				onEscapeKeyDown={event => editingRecord && event.preventDefault()}
				side={isMobile ? "bottom" : "right"}
				overlayClassName="supports-backdrop-filter:backdrop-blur-xs"
				className="gap-0 data-[side=bottom]:max-h-[85dvh] data-[side=bottom]:rounded-t-2xl md:data-[side=right]:max-w-xl"
			>
				{isMobile ? (
					<span
						aria-hidden="true"
						className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-muted-foreground/40"
					/>
				) : null}
				<SheetHeader className="gap-1 border-b p-4 pr-12 md:px-6">
					<SheetTitle className="text-base">{shown.title}</SheetTitle>
					<SheetDescription>{shown.description}</SheetDescription>
				</SheetHeader>
				<div className="grid min-h-0 flex-1 content-start gap-5 overflow-y-auto p-4 md:px-6">
					{shown.records.length ? (
						<DataTable
							data={shown.records}
							columns={columns}
							mobileRow={mobileRow}
							groupBy={byRecordDay}
							onRowClick={handleEdit}
						/>
					) : (
						<p className="text-muted-foreground">No Records</p>
					)}
				</div>
				{editingRecord ? (
					<RecordEditorDialog
						record={editingRecord}
						statements={editingRecord.statements}
						categories={categories ?? []}
						container={content}
						isOpen
						setIsOpen={isOpen => {
							if (!isOpen) setEditingRecord(null)
						}}
					/>
				) : null}
			</SheetContent>
		</Sheet>
	)
}
