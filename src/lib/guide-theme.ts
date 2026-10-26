// Colours shared by the Help pages and the guide film (`video/look.css`). Every domain object keeps
// one colour, so a viewer learns "blue is the bank, green is my explanation" once.
export const color = {
	night: "#08080a",
	statement: "#4c9bff",
	allocation: "#a594ff",
	record: "#34d399",
	pending: "#fbb33c",
} as const

/** One accent per guide level, used for the Help pages' light and chapter chrome. */
const groupAccent: Record<string, string> = {
	"The basics": color.statement,
	"Going further": color.record,
	Advanced: color.allocation,
	"Your data": color.pending,
}

export const accentFor = (group: string) => groupAccent[group] ?? color.statement
