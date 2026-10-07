"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
import AccountDialog from "@/components/dialogs/account"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { dayLabel, isInteractiveTarget } from "@/components/table/row-groups"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useHistory } from "@/history"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { bankMeta } from "@/lib/banks"
import { SPRING } from "@/lib/motion"
import { cn, formatCurrency } from "@/lib/utils"
import { type AccountActivity, listAccounts } from "@/logic/accounts"
import { pathAccount, pathAllocator } from "@/routes"
import type { Account } from "@/types"

type AccountRow = Account & AccountActivity

export default function AccountsPage() {
	const [editingAccount, setEditingAccount] = useState<Account | null>(null)
	const { query, handleQueryChange } = usePaginatedTableState()
	const accounts = useLiveQuery(() => listAccounts(query), [query])

	return (
		<>
			<PageContent>
				<PageHeader
					title="Accounts"
					subtitle="Bank accounts whose activity you import. Accounts are created automatically by the Importer."
					description="Account directory"
					icon="lucide:landmark"
				/>

				<div className="relative max-w-sm">
					<IconifyIcon
						icon="lucide:search"
						className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						type="search"
						aria-label="Search accounts"
						placeholder="Search accounts..."
						className="pl-8"
						value={query}
						onChange={event => handleQueryChange(event.target.value)}
					/>
				</div>

				{accounts === undefined ? null : accounts.length === 0 ? (
					<p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
						{query
							? "No accounts match your search."
							: "No accounts yet. Import a bank export to create one."}
					</p>
				) : (
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{accounts.map((account, index) => (
							<motion.div
								key={account.id}
								className="grid"
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ ...SPRING.smooth, delay: Math.min(index, 7) * 0.03 }}
							>
								<AccountCard
									account={account}
									onEdit={() => setEditingAccount(account)}
								/>
							</motion.div>
						))}
					</div>
				)}
			</PageContent>

			{editingAccount ? (
				<AccountDialog
					account={editingAccount}
					isOpen
					setIsOpen={open => {
						if (!open) setEditingAccount(null)
					}}
				/>
			) : null}
		</>
	)
}

function AccountCard({ account, onEdit }: { account: AccountRow; onEdit: () => void }) {
	const router = useRouter()
	const { handlePush } = useHistory()
	const bank = bankMeta(account.bank)
	const net = account.inflow_30d - account.outflow_30d
	const open = () => {
		handlePush("Accounts")()
		router.push(pathAccount(account.id))
	}

	return (
		<article
			className="group grid cursor-pointer content-start gap-4 rounded-xl border bg-card p-4 transition-[box-shadow,transform] duration-150 ease-out hover:shadow-md active:scale-[0.99]"
			onClick={event => {
				if (!isInteractiveTarget(event.target)) open()
			}}
		>
			<header className="flex items-start gap-3">
				<span
					className="grid size-10 shrink-0 place-items-center rounded-lg text-xs font-bold text-white"
					style={{ backgroundColor: bank.color }}
				>
					{bank.short}
				</span>
				<div className="min-w-0 flex-1">
					<h3 className="truncate font-semibold">{account.name}</h3>
					<p className="truncate text-xs text-muted-foreground">
						{bank.label}
						{account.last_activity
							? ` · last activity ${dayLabel(account.last_activity.slice(0, 10)).toLowerCase()}`
							: " · no activity yet"}
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon-sm"
					title="Rename"
					aria-label={`Rename ${account.name}`}
					className="-mt-1 -mr-1 opacity-60 group-hover:opacity-100"
					onClick={onEdit}
				>
					<IconifyIcon icon="lucide:pencil" />
				</Button>
			</header>

			<div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3 text-xs">
				<div>
					<p className="text-muted-foreground">In · 30 days</p>
					<p className="mt-0.5 text-sm font-semibold text-creative tabular-nums">
						{formatCurrency(account.inflow_30d)}
					</p>
				</div>
				<div>
					<p className="text-muted-foreground">Out · 30 days</p>
					<p className="mt-0.5 text-sm font-semibold text-destructive tabular-nums">
						{formatCurrency(-account.outflow_30d)}
					</p>
				</div>
				<div className="col-span-2 flex items-center justify-between border-t pt-2">
					<span className="text-muted-foreground">Net</span>
					<span
						className={cn(
							"font-medium tabular-nums",
							net < 0 ? "text-destructive" : net > 0 ? "text-creative" : undefined,
						)}
					>
						{formatCurrency(net)}
					</span>
				</div>
			</div>

			<footer className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
				<span>{account.statements_count.toLocaleString()} Statements</span>
				{account.unallocated_count ? (
					<a
						href={pathAllocator({ account_id: account.id })}
						onClick={event => {
							event.preventDefault()
							handlePush("Accounts")()
							router.push(pathAllocator({ account_id: account.id }))
						}}
						className="font-medium text-amber-700 hover:underline dark:text-amber-400"
					>
						{account.unallocated_count} unallocated
					</a>
				) : (
					<span className="text-creative">All allocated</span>
				)}
				{account.pending_count ? <span>{account.pending_count} pending</span> : null}
			</footer>
		</article>
	)
}
