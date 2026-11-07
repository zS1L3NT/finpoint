"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { AllocationProgress } from "@/components/allocation-progress"
import { Badge } from "@/components/ui/badge"
import { TRANSITION } from "@/lib/motion"
import { formatCurrency, round2 } from "@/lib/utils"
import { getRecord, pendingReason, type RecordDetail } from "@/logic/records"
import { getStatement, type StatementDetail } from "@/logic/statements"
import { pathRecord, pathStatement } from "@/routes"

type AllocationSource =
	| { record: RecordDetail; statement?: never }
	| { record?: never; statement: StatementDetail }

export function AllocationRows({
	record,
	statement,
	onStatement,
	showSummary = true,
}: AllocationSource & { onStatement?: (id: string) => void; showSummary?: boolean }) {
	const source = record ?? statement
	const rows = record ? record.statements : statement.records
	const allocated = rows.reduce((sum, row) => sum + row.pivot.amount, 0)
	const remainder = round2(source.amount - allocated)
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={TRANSITION.fast}
			className="grid gap-2 text-xs"
			data-testid="allocation-rows"
		>
			{showSummary ? (
				<AllocationProgress amount={source.amount} allocated={allocated} />
			) : null}
			{showSummary && record?.is_pending && rows.length ? (
				<p className="text-muted-foreground">{pendingReason(record)}</p>
			) : null}
			{rows.map(row => {
				const title = "title" in row ? row.title : row.description
				const content = (
					<>
						<span className="block font-medium">{title}</span>
						<span className="text-muted-foreground tabular-nums">
							{formatCurrency(Math.abs(row.pivot.amount))} of{" "}
							{formatCurrency(Math.abs(row.amount))}
						</span>
						{"statement_count" in row &&
						typeof row.statement_count === "number" &&
						row.statement_count > 1 ? (
							<Badge variant="outline">Shared with other Statements</Badge>
						) : null}
						{"allocation_count" in row && row.allocation_count > 1 ? (
							<Badge variant="outline">Shared with other Records</Badge>
						) : null}
					</>
				)
				return onStatement ? (
					<button
						type="button"
						key={row.id}
						onClick={() => onStatement(row.id)}
						className="cursor-pointer rounded p-2 text-left hover:bg-muted"
					>
						{content}
					</button>
				) : (
					<Link
						key={row.id}
						href={record ? pathStatement(row.id) : pathRecord(row.id)}
						className="rounded p-2 hover:bg-muted"
					>
						{content}
					</Link>
				)
			})}
			{!rows.length ? <p>No {record ? "Statements" : "Records"} allocated yet.</p> : null}
			{remainder !== 0 ? (
				<p className="text-muted-foreground tabular-nums">
					{formatCurrency(Math.abs(remainder))}{" "}
					{record ? "remaining to allocate" : "unallocated"}
				</p>
			) : null}
		</motion.div>
	)
}

export function AllocationExpansion({ id, kind }: { id: string; kind: "record" | "statement" }) {
	const [open, setOpen] = useState(false)
	const data = useLiveQuery(async () => {
		if (!open) return null
		return kind === "record"
			? { record: await getRecord(id) }
			: { statement: await getStatement(id) }
	}, [id, kind, open])
	return (
		<details onToggle={event => setOpen(event.currentTarget.open)} className="mt-1 min-w-0">
			<summary className="cursor-pointer text-xs text-muted-foreground">Allocations</summary>
			{open && data ? (
				<div className="mt-2 rounded bg-muted/40 p-3">
					<AllocationRows {...data} />
				</div>
			) : null}
		</details>
	)
}
