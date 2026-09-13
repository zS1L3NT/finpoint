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
	const backTarget = back ? (latest ?? back) : null

	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
						Back to {backTarget.name}
					</Button>
				) : null}

				<div className="flex min-w-0 flex-col gap-1">
					<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground md:tracking-[0.22em]">
						<IconifyIcon icon={Icon} className="size-3" />
						{description}
					</div>
					<h2 className="text-2xl font-semibold tracking-tight break-words md:text-3xl">
						{title}
					</h2>
					{subtitle ? (
						<div className="max-w-2xl text-sm text-muted-foreground whitespace-pre-line break-words">
							{subtitle}
						</div>
					) : null}
				</div>
			</div>

			{actions ? (
				<div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
					{actions}
				</div>
			) : null}
		</div>
	)
}
