"use client"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { DrillMode } from "@/logic/settings"

const MODES: { value: DrillMode; label: string; icon: string }[] = [
	{ value: "side", label: "Side peek", icon: "lucide:panel-right" },
	{ value: "center", label: "Center peek", icon: "lucide:app-window" },
	{ value: "full", label: "Full page", icon: "lucide:maximize-2" },
]

export function IconTip({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent side="bottom">{label}</TooltipContent>
		</Tooltip>
	)
}

/** Notion-style "open as" switcher: picking a mode switches live and becomes the default. */
export function DrillModeMenu({
	mode,
	phone,
	onMode,
}: {
	mode: DrillMode
	phone: boolean
	onMode: (mode: DrillMode) => void
}) {
	// Phones have one peek (the bottom sheet), so side and center collapse into it.
	const modes = phone
		? MODES.filter(m => m.value !== "center").map(m =>
				m.value === "side" ? { ...m, label: "Peek", icon: "lucide:panel-bottom" } : m,
			)
		: MODES
	const current = modes.find(m => m.value === (phone && mode === "center" ? "side" : mode))

	return (
		<DropdownMenu>
			<IconTip label="Open as">
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon-lg"
						className="w-auto gap-0.5 px-2"
						aria-label={`Open as: ${current?.label}`}
					>
						<IconifyIcon icon={current?.icon} />
						<IconifyIcon icon="lucide:chevron-down" className="size-3! opacity-60" />
					</Button>
				</DropdownMenuTrigger>
			</IconTip>
			<DropdownMenuContent
				align="end"
				className="w-44"
				// Back on the trigger its tooltip would open and swallow the next Escape.
				onCloseAutoFocus={event => {
					event.preventDefault()
					document.getElementById("drill-title")?.focus({ preventScroll: true })
				}}
			>
				<DropdownMenuRadioGroup
					value={current?.value}
					onValueChange={value => onMode(value as DrillMode)}
				>
					{modes.map(m => (
						<DropdownMenuRadioItem key={m.value} value={m.value}>
							<IconifyIcon icon={m.icon} className="text-muted-foreground" />
							{m.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
