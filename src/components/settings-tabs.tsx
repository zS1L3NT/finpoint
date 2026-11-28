import TabNav from "@/components/tab-nav"
import {
	pathCategories,
	pathDataSettings,
	pathImporter,
	pathSettings,
	pathStatementRules,
} from "@/routes"

const SECTIONS = [
	{ value: "general", label: "General", href: pathSettings() },
	{ value: "categories", label: "Categories", href: pathCategories() },
	{ value: "rules", label: "Statement rules", href: pathStatementRules() },
	{ value: "import", label: "Importer", href: pathImporter() },
	{ value: "data", label: "Data", href: pathDataSettings() },
] as const

/** The pages that set Finpoint up, reached from Settings in the top navigation. */
export default function SettingsTabs({ active }: { active: (typeof SECTIONS)[number]["value"] }) {
	return (
		<TabNav
			label="Settings sections"
			items={SECTIONS.map(section => ({ ...section, active: section.value === active }))}
		/>
	)
}
