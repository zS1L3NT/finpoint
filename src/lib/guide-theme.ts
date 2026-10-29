import { themeColor } from "@/lib/palette"

// Colours shared by the Help pages and the guide film (`video/look.css`). Every domain object keeps
// one colour, so a viewer learns "blue is the bank, green is my explanation" once.
export const color = {
	night: "#08080a",
	statement: "#4c9bff",
	allocation: "#a594ff",
	record: "#34d399",
	pending: "#fbb33c",
} as const

/** One colour and icon per guide level, used for the Help pages' chips, bars and chapter chrome. */
const groupLook: Record<string, { color: string; icon: string }> = {
	"The basics": { color: color.statement, icon: "lucide:sprout" },
	"Going further": { color: color.record, icon: "lucide:route" },
	Advanced: { color: color.allocation, icon: "lucide:chart-no-axes-combined" },
	"Your data": { color: color.pending, icon: "lucide:shield-check" },
}

/** A guide level's colour, as the film's title cards use it. */
export const levelColor = (group: string) => groupLook[group]?.color ?? color.statement

/** A colour at the app's per-theme tone (white icons read on it), exposed as `--level` for `bg-(--level)` classes. */
export const levelStyle = (value: string) =>
	({ "--level": themeColor(value) }) as React.CSSProperties

/** A guide level's icon and `--level` style. */
export function lookFor(group: string) {
	const look = groupLook[group] ?? { color: color.statement, icon: "lucide:sprout" }
	return { icon: look.icon, style: levelStyle(look.color) }
}
