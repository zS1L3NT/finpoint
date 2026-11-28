"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { pluralize } from "@/lib/utils"
import {
	attachRecordFiles,
	deleteRecordFile,
	getRecordFileBlob,
	listRecordFiles,
	type RecordFile,
} from "@/logic/record-files"

export default function RecordFiles({ recordId }: { recordId: string }) {
	const files = useLiveQuery(() => listRecordFiles(recordId), [recordId])

	// The previewed file outlives its row, so a deleted file's dialog can still animate out.
	const [viewing, setViewing] = useState<RecordFile | null>(null)
	const [isViewing, setIsViewing] = useState(false)
	const [busy, setBusy] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleFiles = async (list: FileList | null) => {
		if (!list?.length) return
		setBusy(true)
		try {
			const added = await attachRecordFiles(recordId, [...list])
			toast.success(`${pluralize(added.length, "file")} added.`)
		} catch (cause) {
			toast.error(cause instanceof Error ? cause.message : "Could not add the files.")
		} finally {
			setBusy(false)
			if (inputRef.current) inputRef.current.value = ""
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Files</CardTitle>
				<CardDescription>
					Receipts, invoices and other files for this record.
				</CardDescription>
				<CardAction>
					<Button
						variant="outline"
						size="sm"
						disabled={busy}
						onClick={() => inputRef.current?.click()}
					>
						<IconifyIcon icon="lucide:paperclip" /> Add files
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<input
					ref={inputRef}
					type="file"
					accept="image/*,application/pdf"
					multiple
					hidden
					aria-label="Add files"
					onChange={event => void handleFiles(event.target.files)}
				/>
				{files === undefined ? null : files.length ? (
					<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
						{files.map(file => (
							<li key={file.id}>
								<RecordFileTile
									file={file}
									onOpen={() => {
										setViewing(file)
										setIsViewing(true)
									}}
								/>
							</li>
						))}
					</ul>
				) : (
					<p className="text-xs text-muted-foreground">No files yet.</p>
				)}
			</CardContent>

			{viewing ? (
				<RecordFilePreview
					key={viewing.id}
					file={files?.find(file => file.id === viewing.id) ?? viewing}
					isOpen={isViewing}
					setIsOpen={setIsViewing}
					onClosed={() => setViewing(null)}
				/>
			) : null}
		</Card>
	)
}

function RecordFileTile({ file, onOpen }: { file: RecordFile; onOpen: () => void }) {
	const url = useRecordFileUrl(file)

	return (
		<button
			type="button"
			className="group grid w-full cursor-pointer gap-1.5 rounded-lg text-left"
			onClick={onOpen}
		>
			<span className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border bg-muted/40 transition-colors duration-150 ease-out group-hover:bg-muted">
				{url && file.type.startsWith("image/") ? (
					<img src={url} alt="" className="size-full object-cover object-top" />
				) : (
					<IconifyIcon
						icon={file.available ? "lucide:file-text" : "lucide:cloud-off"}
						className="size-6 text-muted-foreground"
					/>
				)}
			</span>
			<span className="truncate text-xs font-medium">{file.name}</span>
		</button>
	)
}

function RecordFilePreview({
	file,
	isOpen,
	setIsOpen,
	onClosed,
}: {
	file: RecordFile
	isOpen: boolean
	setIsOpen: (open: boolean) => void
	onClosed: () => void
}) {
	const url = useRecordFileUrl(file)

	const [armed, setArmed] = useState(false)

	const handleDelete = async () => {
		if (!armed) {
			setArmed(true)
			return
		}
		try {
			await deleteRecordFile(file.id)
			setIsOpen(false)
		} catch {
			toast.error("Could not delete the file.")
		}
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
			onOpenChangeComplete={open => {
				if (!open) onClosed()
			}}
		>
			<DialogContent className="md:max-w-3xl">
				<DialogHeader>
					<DialogTitle className="truncate">{file.name}</DialogTitle>
					<DialogDescription>{formatFileSize(file.size)}</DialogDescription>
				</DialogHeader>

				<DialogBody>
					{!file.available ? (
						<p className="text-xs text-muted-foreground">
							This file is not in this browser yet. Sync with Google Drive to fetch
							it.
						</p>
					) : !url ? null : file.type.startsWith("image/") ? (
						<img
							src={url}
							alt={file.name}
							className="mx-auto max-h-[70vh] rounded-lg object-contain"
						/>
					) : (
						<iframe
							src={url}
							title={file.name}
							className="h-[70vh] w-full rounded-lg border"
						/>
					)}
				</DialogBody>

				<DialogFooter>
					<Button
						type="button"
						variant="destructive"
						className="sm:mr-auto"
						onClick={handleDelete}
					>
						<IconifyIcon icon="lucide:trash-2" />{" "}
						{armed ? "Yes, delete file" : "Delete"}
					</Button>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Close
							</Button>
						}
					/>
					{url ? (
						<Button asChild>
							<a href={url} download={file.name}>
								<IconifyIcon icon="lucide:download" /> Download
							</a>
						</Button>
					) : null}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

/** An object URL for the file's local bytes, revoked when the file or its bytes change. */
function useRecordFileUrl(file: RecordFile) {
	const blob = useLiveQuery(
		() => (file.available ? getRecordFileBlob(file) : null),
		[file.sha256, file.type, file.available],
	)
	const [url, setUrl] = useState<string | null>(null)

	useEffect(() => {
		if (!blob) {
			setUrl(null)
			return
		}
		const next = URL.createObjectURL(blob)
		setUrl(next)
		return () => URL.revokeObjectURL(next)
	}, [blob])

	return url
}

function formatFileSize(bytes: number) {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
