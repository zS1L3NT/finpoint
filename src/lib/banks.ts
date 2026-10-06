/** Display metadata for the banks the importer understands. */
export const BANKS = [
	{ value: "dbs", label: "DBS", short: "DBS", color: "#e60000", formats: "CSV · many files" },
	{ value: "ocbc", label: "OCBC", short: "OC", color: "#d4111a", formats: "CSV · many files" },
	{ value: "uob", label: "UOB", short: "UOB", color: "#0b3b8c", formats: "XLS · many files" },
	{
		value: "revolut",
		label: "Revolut",
		short: "R",
		color: "#191c1f",
		formats: "CSV · one account",
	},
] as const

export function bankMeta(bank: string) {
	return (
		BANKS.find(item => item.value === bank.toLowerCase()) ?? {
			value: bank,
			label: bank,
			short: bank.slice(0, 2).toUpperCase(),
			color: "#71717a",
			formats: "",
		}
	)
}
