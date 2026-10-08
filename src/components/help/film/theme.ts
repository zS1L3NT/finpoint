import { Easing } from "remotion"

/**
 * Visual language for the guide film. Every domain object keeps one colour for the whole film,
 * so a viewer learns "blue is the bank, green is my explanation" once and can read any diagram.
 */
export const color = {
	night: "#08080a",
	ink: "#fafafa",
	dim: "#a1a1aa",
	faint: "#71717a",
	ghost: "rgba(250, 250, 250, 0.34)",
	surface: "rgba(255, 255, 255, 0.045)",
	raised: "#16161a",
	line: "rgba(255, 255, 255, 0.09)",
	statement: "#4c9bff",
	allocation: "#a594ff",
	record: "#34d399",
	pending: "#fbb33c",
	danger: "#ff7a7a",
	income: "#4c9bff",
	spending: "#ff8a4c",
	saving: "#c084fc",
	neutral: "#94a3b8",
	pink: "#f472b6",
} as const

export const font = {
	sans: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
	numbers: { fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum", "cv11"' },
} as const

/** One accent per guide level, used for the ambient light and chapter chrome. */
export const groupAccent: Record<string, string> = {
	"The basics": color.statement,
	"Going further": color.record,
	Advanced: color.allocation,
	"Your data": color.pending,
}

export const accentFor = (group: string) => groupAccent[group] ?? color.statement

/** Mirrors the app's motion tokens (`src/lib/motion.ts`). */
export const ease = {
	out: Easing.bezier(0.23, 1, 0.32, 1),
	inOut: Easing.bezier(0.77, 0, 0.175, 1),
}

/**
 * Frame geometry for the 16:9 film. Narration reads down a left column; the scene plays on a
 * 952 × 520 stage on the right, scaled up to fill it.
 */
export const layout = {
	width: 1920,
	height: 1080,
	gutter: 88,
	columnTop: 236,
	columnWidth: 640,
	stageScale: 1.1,
	stageLeft: 1920 - 88 - 952 * 1.1,
	stageTop: 300,
	/** Top of the filmed screen on demo beats, just under the header. */
	demoTop: 148,
} as const

/** `−$1,234` / `+$60` / `$0`, using a real minus sign like the rest of the guide copy. */
export function money(value: number, { signed = true }: { signed?: boolean } = {}) {
	const rounded = Math.round(value)
	const digits = Math.abs(rounded).toLocaleString("en-US")
	if (!signed || rounded === 0) return `$${digits}`
	return `${value < 0 ? "−" : "+"}$${digits}`
}

export const alpha = (hex: string, amount: number) =>
	`${hex}${Math.round(amount * 255)
		.toString(16)
		.padStart(2, "0")}`
