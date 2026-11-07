"use client"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const DEFINITIONS = {
	Pending:
		"A Record is pending when the allocated money does not add up to its amount, or a Statement is unconfirmed. For example, a $20 Record with only $15 allocated is pending.",
	Allocation:
		"An Allocation assigns part or all of a Statement amount to a Record. For example, $12 of a $30 Statement can explain one Record.",
	"Effective spending":
		"Personal spending with refunds subtracted, excluding transfers and saving / investment. For example, $50 spent and a $10 refund count as $40.",
	"Left over":
		"Income minus personal spending, before money moved into savings or investments. For example, $3,000 income minus $2,000 spending leaves $1,000.",
} as const

export default function Term({ name, label }: { name: keyof typeof DEFINITIONS; label?: string }) {
	const [open, setOpen] = useState(false)
	return (
		<Tooltip open={open} onOpenChange={setOpen}>
			<TooltipTrigger asChild>
				<span
					role="button"
					tabIndex={0}
					aria-label={`Define ${name}`}
					className="inline cursor-pointer underline decoration-dotted underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
					onKeyDown={event => {
						if (event.key === "Enter" || event.key === " ") {
							event.preventDefault()
							event.stopPropagation()
							setOpen(true)
						}
					}}
					onClick={event => {
						event.stopPropagation()
						setOpen(true)
					}}
				>
					{label ?? name}
				</span>
			</TooltipTrigger>
			<TooltipContent>{DEFINITIONS[name]}</TooltipContent>
		</Tooltip>
	)
}
