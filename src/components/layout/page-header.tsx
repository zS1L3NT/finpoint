"use client"

import { UiIcon as IconifyIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { type HistoryItem, useHistory } from "@/history"

export default function PageHeader({
	title,
	subtitle,
	description,
	icon: Icon,
	actions,
	back,
}: {
	title: React.ReactNode
	subtitle?: React.ReactNode
	description: React.ReactNode
	icon: string
	actions?: React.ReactNode
	back?: HistoryItem
}) {
	const { latest, isNavigatingBack, navigateBack } = useHistory()
	const backTarget = latest ?? back ?? null

	return (
		<div className="flex flex-col gap-4 @2xl/page:flex-row @2xl/page:items-end @2xl/page:justify-between">
			<div className="flex min-w-0 flex-col gap-4">
				{backTarget ? (
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="w-fit max-w-full self-start"
						disabled={isNavigatingBack}
						aria-busy={isNavigatingBack}
						onClick={() => navigateBack(back ?? backTarget)}
					>
						<IconifyIcon
							icon={isNavigatingBack ? "lucide:loader-circle" : "lucide:arrow-left"}
							className={isNavigatingBack ? "animate-spin" : undefined}
						/>
						<span className="truncate">Back to {backTarget.name}</span>
					</Button>
				) : null}

				<div className="flex min-w-0 flex-col gap-1">
					<div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
						<IconifyIcon icon={Icon} className="size-3.5" />
						{description}
					</div>
					<h2 className="text-xl font-semibold tracking-tight break-words md:text-2xl">
						{title}
					</h2>
					{subtitle ? (
						<div className="max-w-prose text-xs text-muted-foreground whitespace-pre-line break-words">
							{subtitle}
						</div>
					) : null}
				</div>
			</div>

			{actions ? (
				<div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap @2xl/page:w-auto @2xl/page:justify-end">
					{actions}
				</div>
			) : null}
		</div>
	)
}
