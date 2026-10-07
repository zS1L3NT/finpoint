"use client"

import { ArrowUpRight, CircleHelp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { GuideArticle } from "@/components/help/guide-article"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getGuideTopic, guideTopics } from "@/lib/guide-content"
import { cn } from "@/lib/utils"
import { pathHelp } from "@/routes"

function topicForPath(path: string) {
	if (path.startsWith("/importer") || path.startsWith("/statements")) return "import"
	if (path.startsWith("/sync")) return "sync"
	if (path.startsWith("/budgets")) return "budgets"
	if (path.startsWith("/categories")) return "categories"
	if (path.startsWith("/allocator/pending")) return "pending"
	if (path.startsWith("/allocator")) return "lunch"
	if (path.startsWith("/records")) return "pending"
	if (path === "/") return "dashboard"
	if (path.startsWith("/settings")) return "routine"
	return "start"
}

/**
 * Help for the current page or form, read in a side panel so the form underneath keeps its
 * inputs. `form` renders a small icon beside a dialog's close button; `header` is the top bar's
 * quiet text button; `inline` is a plain link-style button for lesson pages.
 */
export function ContextHelp({
	topic: topicId,
	label = "Help",
	variant = "header",
}: {
	topic?: string
	label?: string
	variant?: "header" | "form" | "inline"
}) {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	const [selected, setSelected] = useState<string | null>(null)
	const topic = getGuideTopic(selected ?? topicId ?? topicForPath(pathname))
	const trigger =
		variant === "form" ? (
			<Button
				variant="ghost"
				size="icon-sm"
				aria-label={label}
				className="absolute top-2 right-10 text-muted-foreground hover:text-foreground"
			>
				<CircleHelp />
			</Button>
		) : (
			<Button
				variant="ghost"
				size="sm"
				className={cn(
					"gap-1.5 text-muted-foreground hover:text-foreground",
					variant === "inline" && "-ml-2 w-fit",
				)}
			>
				<CircleHelp />
				{label}
			</Button>
		)
	return (
		<Dialog
			open={open}
			onOpenChange={open => {
				setOpen(open)
				if (!open) setSelected(null)
			}}
		>
			{variant === "form" ? (
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger render={trigger} />
					</TooltipTrigger>
					<TooltipContent>{label}</TooltipContent>
				</Tooltip>
			) : (
				<DialogTrigger render={trigger} />
			)}
			<DialogContent className="gap-5 md:top-3 md:right-3 md:bottom-3 md:left-auto md:max-h-none md:max-w-md md:translate-x-0 md:translate-y-0 md:p-6 data-open:md:slide-in-from-right-6 data-open:md:zoom-in-100">
				<DialogHeader className="gap-1 pr-8">
					<p className="flex items-center gap-1.5 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
						<CircleHelp className="size-3.5" />
						{topic.group}
					</p>
					<DialogTitle className="text-lg leading-6 text-balance">
						{topic.title}
					</DialogTitle>
					<DialogDescription className="sr-only">
						Help for this page. Closing it returns you to your inputs.
					</DialogDescription>
				</DialogHeader>
				<label className="flex flex-col gap-1.5 text-xs text-muted-foreground">
					Other questions
					<select
						value={topic.id}
						onChange={event => setSelected(event.target.value)}
						className="h-9 w-full rounded-md border bg-background px-2.5 text-sm text-foreground"
					>
						{guideTopics.map(item => (
							<option key={item.id} value={item.id}>
								{item.title}
							</option>
						))}
					</select>
				</label>
				<GuideArticle topic={topic} compact />
				<div className="mt-auto flex flex-col gap-4 border-t pt-4">
					<div className="flex items-center justify-between gap-2">
						<Button asChild variant="ghost" size="sm" className="-ml-2">
							<Link
								href={pathHelp(topic.id)}
								onClick={() => {
									setOpen(false)
									setSelected(null)
								}}
							>
								Full guide <ArrowUpRight />
							</Link>
						</Button>
						<DialogClose render={<Button size="sm">Back to what I was doing</Button>} />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
