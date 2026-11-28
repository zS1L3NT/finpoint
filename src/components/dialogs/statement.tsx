import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useRef, useState } from "react"
import {
	AllocationList,
	allocatedOf,
	PreviewHeader,
	PreviewItem,
	PreviewSection,
} from "@/components/dialogs/item-preview"
import { PendingStatementForm } from "@/components/dialogs/pending-statement"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { StatementBadges } from "@/components/table/statement-columns"
import { Button } from "@/components/ui/button"
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { useDialogCloseAnimation } from "@/hooks/use-dialog-close-animation"
import { useRecordEditor } from "@/hooks/use-record-editor"
import { useSubmitLock } from "@/hooks/use-submit-lock"
import { bankMeta } from "@/lib/banks"
import { themeColor } from "@/lib/palette"
import { classForCurrency, cn, formatCurrency, formatDatetime, round2 } from "@/lib/utils"
import { listAccounts } from "@/logic/accounts"
import { listCategories } from "@/logic/categories"
import { getStatement, type StatementDetail } from "@/logic/statements"
import type { Statement } from "@/types"

/**
 * A Statement in a modal, read-only, with its allocated Records. A Pending Statement's Edit swaps
 * the same modal to its form; imported Statements change only by importing again.
 */
export default function StatementDialog({
	statement,
	isOpen,
	setIsOpen: onOpenChange,
	container,
	nested = false,
}: {
	statement: Statement
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	/** Where the dialog mounts: the sheet it was opened from, when there is one. */
	container?: HTMLElement | null
	/** Opened from a Record preview, so its Records do not open another level. */
	nested?: boolean
}) {
	const { open, setIsOpen, onOpenChangeComplete } = useDialogCloseAnimation(isOpen, onOpenChange)
	const [mode, setMode] = useState<"view" | "edit">("view")
	// Whether this opening has been to the form, so the preview hands focus back to Edit.
	const [hasEdited, setHasEdited] = useState(false)
	const editButton = useRef<HTMLButtonElement>(null)
	const popup = useRef<HTMLDivElement>(null)
	const { locked, run } = useSubmitLock(isOpen && mode === "edit")
	const accounts = useLiveQuery(() => listAccounts(), [])
	const categories = useLiveQuery(() => listCategories(), []) ?? []
	// The preview follows saves, from this form or another tab, as they land.
	const live = useLiveQuery(() => getStatement(statement.id).catch(() => null), [statement.id])
	const current: StatementDetail = live ?? { ...statement, records: [] }
	const { editingRecord, handleEdit, setEditingRecord } = useRecordEditor()

	return (
		<Dialog
			open={open}
			onOpenChangeComplete={onOpenChangeComplete}
			onOpenChange={isOpen => {
				setIsOpen(isOpen)
				if (isOpen) {
					setMode("view")
					setHasEdited(false)
				}
			}}
		>
			{live === undefined || accounts === undefined ? null : (
				<DialogContent
					container={container}
					ref={popup}
					// A Pending one opens on Edit; an imported one has no action, so the dialog itself
					// takes focus rather than its first Record row.
					initialFocus={
						mode === "view" ? (current.is_pending ? editButton : popup) : undefined
					}
					className="md:max-w-4xl"
				>
					{mode === "view" ? (
						<StatementPreview
							statement={current}
							editButton={editButton}
							focusEdit={hasEdited}
							onEdit={() => {
								setHasEdited(true)
								setMode("edit")
							}}
							onOpenRecord={nested ? undefined : handleEdit}
						/>
					) : (
						<>
							<StatementDialogHeader
								statement={current}
								label="Edit Pending Statement"
							/>
							<PendingStatementForm
								statement={current}
								accounts={accounts}
								locked={locked}
								run={run}
								focusFirstField
								onDone={() => setMode("view")}
								onDeleted={() => setIsOpen(false)}
								// Allocations change from a Record or the Allocator, so here they stay read-only.
								aside={<StatementAllocations statement={current} />}
							/>
						</>
					)}

					{editingRecord ? (
						<RecordEditorDialog
							record={editingRecord}
							statements={editingRecord.statements}
							categories={categories}
							isOpen
							setIsOpen={isOpen => {
								if (!isOpen) setEditingRecord(null)
							}}
							container={container}
							nested
						/>
					) : null}
				</DialogContent>
			)}
		</Dialog>
	)
}

function StatementDialogHeader({ statement, label }: { statement: Statement; label: string }) {
	const bank = bankMeta(statement.account.bank)
	return (
		<PreviewHeader
			media={
				<span
					aria-hidden="true"
					className="grid size-9 shrink-0 place-items-center rounded text-[0.6875rem] font-bold text-white"
					style={{ backgroundColor: themeColor(bank.color) }}
				>
					{bank.short}
				</span>
			}
			label={label}
			title={statement.description || "No description"}
			badge={<StatementBadges statement={statement} showUnallocated={false} />}
			details={[
				<span
					key="amount"
					className={cn("tabular-nums", classForCurrency(statement.amount))}
				>
					{formatCurrency(statement.amount)}
				</span>,
				formatDatetime(statement.datetime),
				statement.account.name,
			]}
		/>
	)
}

/** What a row opens: the Statement and the Records it is allocated to. */
function StatementPreview({
	statement,
	editButton,
	focusEdit,
	onEdit,
	onOpenRecord,
}: {
	statement: StatementDetail
	editButton: React.RefObject<HTMLButtonElement | null>
	/** Back from the form: Edit takes focus again, where the Save or Cancel press left off. */
	focusEdit: boolean
	onEdit: () => void
	onOpenRecord?: (record: StatementDetail["records"][number]) => void
}) {
	useEffect(() => {
		if (focusEdit) editButton.current?.focus()
	}, [focusEdit, editButton])

	return (
		<>
			<StatementDialogHeader statement={statement} label="Statement" />

			<DialogBody>
				{/* Back from the form, the preview fades in where it was; opening, the popup enters whole. */}
				<div
					className={cn(
						"grid gap-8 lg:grid-cols-2",
						focusEdit && "fade-in animate-in duration-150 ease-out",
					)}
				>
					<PreviewSection title="Statement information">
						<dl className="grid grid-cols-2 gap-x-6 gap-y-4">
							<PreviewItem label="Account">
								<span className="grid gap-0.5">
									{statement.account.name}
									<span className="text-xs text-muted-foreground">
										{bankMeta(statement.account.bank).label}
									</span>
								</span>
							</PreviewItem>
							<PreviewItem label="Status">
								{statement.is_pending ? (
									<span className="grid gap-0.5">
										Pending
										<span className="text-xs text-muted-foreground">
											Awaiting confirmation
										</span>
									</span>
								) : (
									"Confirmed"
								)}
							</PreviewItem>
							<PreviewItem label="Description" className="col-span-2">
								{statement.description ? (
									<span className="whitespace-pre-wrap">
										{statement.description}
									</span>
								) : null}
							</PreviewItem>
						</dl>
					</PreviewSection>

					<StatementAllocations statement={statement} onOpenRecord={onOpenRecord} />
				</div>
			</DialogBody>

			{/* Imported Statements are read-only; the corner X and Escape close. */}
			{statement.is_pending ? (
				<DialogFooter>
					<Button ref={editButton} type="button" onClick={onEdit}>
						<IconifyIcon icon="lucide:pencil" data-icon="inline-start" />
						Edit
					</Button>
				</DialogFooter>
			) : null}
		</>
	)
}

/** The Records this Statement is allocated to, in the same place in both modes. */
function StatementAllocations({
	statement,
	onOpenRecord,
}: {
	statement: StatementDetail
	onOpenRecord?: (record: StatementDetail["records"][number]) => void
}) {
	return (
		<PreviewSection
			title="Record allocations"
			description={allocatedOf(
				round2(statement.amount - statement.allocable_amount),
				statement.amount,
			)}
		>
			<AllocationList
				items={statement.records}
				empty={{
					icon: "lucide:receipt-text",
					title: "No Records",
					description: "Allocate this Statement from a Record or the Allocator.",
				}}
				render={record => ({
					title: record.title,
					details: [record.category.name, formatDatetime(record.datetime)],
					allocated: record.pivot.amount,
					amount: record.amount,
				})}
				onOpen={onOpenRecord}
			/>
		</PreviewSection>
	)
}
