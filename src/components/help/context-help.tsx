"use client"

import { CircleHelp } from "lucide-react"
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
import { getGuideTopic, guideTopics } from "@/lib/guide-content"
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

export function ContextHelp({
	topic: topicId,
	label = "Help",
}: {
	topic?: string
	label?: string
}) {
	const pathname = usePathname()
	const [selected, setSelected] = useState<string | null>(null)
	const topic = getGuideTopic(selected ?? topicId ?? topicForPath(pathname))
	return (
		<Dialog
			onOpenChange={open => {
				if (!open) setSelected(null)
			}}
		>
			<DialogTrigger
				render={
					<Button variant="ghost" size="lg" className="min-h-11 gap-2">
						<CircleHelp />
						{label}
					</Button>
				}
			/>
			<DialogContent className="md:max-w-2xl">
				<DialogHeader className="pr-8">
					<DialogTitle className="text-lg leading-6">{topic.title}</DialogTitle>
					<DialogDescription>
						Read this here. Close Help to return to your current inputs.
					</DialogDescription>
				</DialogHeader>
				<label className="flex flex-col gap-2 text-sm">
					<span className="font-medium">Choose a question</span>
					<select
						value={topic.id}
						onChange={event => setSelected(event.target.value)}
						className="min-h-11 w-full rounded-md border bg-background px-3 text-sm"
					>
						{guideTopics.map(item => (
							<option key={item.id} value={item.id}>
								{item.title}
							</option>
						))}
					</select>
				</label>
				<GuideArticle topic={topic} compact />
				<div className="flex flex-col gap-2 sm:flex-row">
					<DialogClose
						render={
							<Button size="lg" className="min-h-11">
								Return to what I was doing
							</Button>
						}
					/>
					<Button asChild variant="outline" size="lg" className="min-h-11">
						<Link href={pathHelp(topic.id)}>Open full guide (leave this page)</Link>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
