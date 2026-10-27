"use client"

import { ArrowUpRight, BookOpen, CircleHelp, CirclePlay, List } from "lucide-react"
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
} from "@/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getGuideChapter } from "@/lib/guide"
import { cn } from "@/lib/utils"
import { pathHelp, pathHelpVideo } from "@/routes"

/** The guides that matter on each section, most relevant first. The first prefix that matches wins. */
const sectionGuides: [prefix: string, topics: string[]][] = [
	["/importer", ["import", "pending-statements", "duplicates", "workspace"]],
	["/statement-rules", ["rules", "categories", "allocator"]],
	["/statements", ["pending-statements", "duplicates", "rules", "model"]],
	["/accounts", ["import", "find", "sync"]],
	["/settings", ["find", "sync", "routine"]],
	["/sync", ["sync", "routine"]],
	["/budgets", ["budgets", "buckets", "treatments"]],
	["/categories", ["categories", "treatments", "buckets"]],
	["/allocator/pending", ["pending-statements", "pending", "allocator"]],
	["/allocator/duplicates", ["duplicates", "import"]],
	["/allocator", ["allocator", "lunch", "split", "repayment", "pending"]],
	["/records/monthly", ["monthly", "find", "dashboard"]],
	["/records", ["find", "lunch", "categories", "pending"]],
]
const homeGuides = ["dashboard", "insights", "treatments", "buckets"]
const startGuides = ["start", "model", "workspace", "routine"]

function guidesFor(path: string, topic?: string) {
	const section =
		path === "/"
			? homeGuides
			: (sectionGuides.find(([prefix]) => path.startsWith(prefix))?.[1] ?? startGuides)
	return [...new Set(topic ? [topic, ...section] : section)].map(getGuideChapter)
}

/**
 * Help for the current page or form, read in a side panel so the form underneath keeps its
 * inputs. `header` is the top bar's menu of this section's guides; `form` renders a small icon
 * beside a dialog's close button; `inline` is a plain link-style button.
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
	const guides = guidesFor(pathname, topicId)
	const topic = getGuideChapter(selected ?? guides[0]?.id ?? "start")
	const show = (id = guides[0]?.id ?? "start") => {
		setSelected(id)
		setOpen(true)
	}
	const trigger =
		variant === "form" ? (
			<Button
				variant="ghost"
				size="icon-sm"
				aria-label={label}
				onClick={() => show()}
				className="absolute top-2 right-10 text-muted-foreground hover:text-foreground"
			>
				<CircleHelp />
			</Button>
		) : (
			<Button
				variant="ghost"
				size="sm"
				onClick={variant === "inline" ? () => show() : undefined}
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
		<>
			{variant === "header" ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-72">
						<DropdownMenuLabel>Guides for this page</DropdownMenuLabel>
						{guides.map(guide => (
							<DropdownMenuItem key={guide.id} onSelect={() => show(guide.id)}>
								<BookOpen />
								{guide.title}
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href={pathHelpVideo(guides[0]?.id)}>
								<CirclePlay />
								Watch this in the video guide
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href={pathHelp()}>
								<List />
								All help topics
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : variant === "form" ? (
				<Tooltip>
					<TooltipTrigger asChild>{trigger}</TooltipTrigger>
					<TooltipContent>{label}</TooltipContent>
				</Tooltip>
			) : (
				trigger
			)}
			<Dialog
				open={open}
				onOpenChange={open => {
					setOpen(open)
					if (!open) setSelected(null)
				}}
			>
				<DialogContent className="gap-5 md:top-3 md:right-3 md:bottom-3 md:left-auto md:max-h-none md:max-w-md md:translate-x-0 md:translate-y-0 md:p-6 data-open:md:slide-in-from-right-6 data-open:md:zoom-in-100">
					<DialogHeader className="gap-1 pr-8">
						<p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
							<CircleHelp className="size-3.5" />
							{topic.level}
						</p>
						<DialogTitle className="text-lg leading-6 text-balance">
							{topic.title}
						</DialogTitle>
						<DialogDescription className="sr-only">
							Help for this page. Closing it returns you to your inputs.
						</DialogDescription>
					</DialogHeader>
					{guides.length > 1 && (
						<div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
							<span id="related-guides">Related guides</span>
							<Select value={topic.id} onValueChange={setSelected}>
								<SelectTrigger className="w-full" aria-labelledby="related-guides">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{guides.map(guide => (
											<SelectItem key={guide.id} value={guide.id}>
												{guide.title}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					)}
					<GuideArticle chapter={topic} compact />
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
							<DialogClose
								render={<Button size="sm">Back to what I was doing</Button>}
							/>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
