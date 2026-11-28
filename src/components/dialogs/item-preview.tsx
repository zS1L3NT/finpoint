import { Fragment } from "react"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { classForCurrency, cn, formatCurrency } from "@/lib/utils"

// The parts a Record and a Statement modal share, so both read as one design in either mode.

/** The item's media, name and status, with its details beneath, above either mode. */
export function PreviewHeader({
	media,
	label,
	title,
	badge,
	details,
	children,
}: {
	media: React.ReactNode
	/** Names the dialog, as a small label over the item's own title. */
	label: string
	title: string
	badge?: React.ReactNode
	/** Joined by middle dots; phones give the last its own line, so no dot starts a line. */
	details: React.ReactNode[]
	children?: React.ReactNode
}) {
	return (
		<DialogHeader className="-mx-4 gap-3 border-b px-4 pr-12 pb-4">
			<div className="flex min-w-0 items-start gap-3">
				{media}
				<div className="grid min-w-0 gap-0.5">
					<DialogTitle className="text-xs font-medium text-muted-foreground">
						{label}
					</DialogTitle>
					{/* The description carries the title too, so screen readers hear what opened. */}
					<DialogDescription render={<div />} className="grid min-w-0 gap-0.5">
						<span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold text-foreground">
							<span className="min-w-0 break-words">{title}</span>
							{badge}
						</span>
						<Separated parts={details} />
					</DialogDescription>
				</div>
			</div>
			{children}
		</DialogHeader>
	)
}

/** Parts joined by middle dots; phones give the last its own line, so no dot ends a line. */
function Separated({ parts }: { parts: React.ReactNode[] }) {
	return (
		<span className="flex min-w-0 flex-wrap items-center gap-x-1.5">
			{parts.map((part, index) => (
				<Fragment key={index}>
					{index ? (
						<span
							aria-hidden="true"
							className={cn(index === parts.length - 1 && "max-sm:hidden")}
						>
							·
						</span>
					) : null}
					<span
						className={cn("min-w-0", index === parts.length - 1 && "max-sm:basis-full")}
					>
						{part}
					</span>
				</Fragment>
			))}
		</span>
	)
}

/** A section's title, with an optional muted line under it and an action beside it. */
export function PreviewSection({
	title,
	description,
	action,
	className,
	children,
}: {
	title: string
	description?: React.ReactNode
	action?: React.ReactNode
	className?: string
	children: React.ReactNode
}) {
	return (
		<section className={cn("flex min-w-0 flex-col gap-4", className)}>
			<div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="grid gap-0.5">
					<h3 className="text-sm font-semibold">{title}</h3>
					{description ? (
						<p className="text-xs text-muted-foreground tabular-nums">{description}</p>
					) : null}
				</div>
				{action}
			</div>
			{children}
		</section>
	)
}

/** "X of Y allocated", the line under both modes' allocations heading. */
export function allocatedOf(allocated: number, amount: number) {
	return `${formatCurrency(allocated)} of ${formatCurrency(amount)} allocated`
}

export function PreviewItem({
	label,
	className,
	children,
}: {
	label: string
	className?: string
	children: React.ReactNode
}) {
	return (
		<div className={cn("grid min-w-0 content-start gap-1", className)}>
			<dt className="text-xs text-muted-foreground">{label}</dt>
			<dd className="min-w-0 text-sm break-words">
				{children || <span className="text-muted-foreground">—</span>}
			</dd>
		</div>
	)
}

/** The other side of each Allocation: a row per item, opening it when `onOpen` is given. */
export function AllocationList<TItem extends { id: string }>({
	items,
	empty,
	render,
	onOpen,
}: {
	items: TItem[]
	empty: { icon: string; title: string; description: string }
	render: (item: TItem) => {
		title: string
		/** Who and when; phones give the last its own line, as in the header. */
		details: React.ReactNode[]
		allocated: number
		amount: number
	}
	onOpen?: (item: TItem) => void
}) {
	if (!items.length)
		return (
			<Empty className="rounded-lg border border-dashed">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<IconifyIcon icon={empty.icon} />
					</EmptyMedia>
					<EmptyTitle>{empty.title}</EmptyTitle>
					<EmptyDescription>{empty.description}</EmptyDescription>
				</EmptyHeader>
			</Empty>
		)

	return (
		<ul className="divide-y overflow-hidden rounded-lg border">
			{items.map(item => {
				const row = render(item)
				const content = (
					<>
						<span className="grid min-w-0 flex-1 gap-0.5">
							<span className="line-clamp-2 text-sm font-medium break-words">
								{row.title}
							</span>
							<span className="text-xs text-muted-foreground">
								<Separated parts={row.details} />
							</span>
						</span>
						<span className="grid shrink-0 justify-items-end gap-0.5 text-right tabular-nums">
							<span className={cn("font-medium", classForCurrency(row.allocated))}>
								{formatCurrency(row.allocated)}
							</span>
							<span className="text-[0.6875rem] text-muted-foreground">
								of {formatCurrency(row.amount)}
							</span>
						</span>
					</>
				)
				return (
					<li key={item.id}>
						{onOpen ? (
							<button
								type="button"
								aria-label={`Open ${row.title}`}
								className="flex w-full min-w-0 cursor-pointer items-center gap-3 px-3 py-2.5 text-left outline-none transition-colors duration-150 ease-out hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset active:bg-muted/60"
								onClick={() => onOpen(item)}
							>
								{content}
								<IconifyIcon
									icon="lucide:chevron-right"
									className="size-3.5 shrink-0 text-muted-foreground"
								/>
							</button>
						) : (
							<div className="flex min-w-0 items-center gap-3 px-3 py-2.5">
								{content}
							</div>
						)}
					</li>
				)
			})}
		</ul>
	)
}
