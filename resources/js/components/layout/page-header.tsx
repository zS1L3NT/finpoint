import { Link } from "@inertiajs/react"
import { ArrowLeftIcon, type LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

export default function PageHeader({
	title,
	subtitle,
	description,
	icon: Icon,
	actions,
	back,
}: {
	title: ReactNode
	subtitle?: ReactNode
	description: ReactNode
	icon: LucideIcon
	actions?: ReactNode
	back?: { name: ReactNode; url: string }
}) {
	return (
		<div className="flex justify-between items-end">
			<div className="space-y-4">
				{back ? (
					<Button variant="outline" size="sm" asChild>
						<Link href={back.url}>
							<ArrowLeftIcon />
							{back.name}
						</Link>
					</Button>
				) : null}

				<div className="space-y-1">
					<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
						<Icon className="size-3" />
						{description}
					</div>
					<h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
					{subtitle ? (
						<p className="max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
					) : null}
				</div>
			</div>

			{actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
		</div>
	)
}
