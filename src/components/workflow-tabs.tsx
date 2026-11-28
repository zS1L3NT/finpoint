import { DateTime } from "luxon"
import TabNav from "@/components/tab-nav"
import { useDefaultFilterEndDateToday, useDefaultFilterStartDate } from "@/hooks/use-settings"
import { pathAllocator, pathAllocatorDuplicates, pathAllocatorPending } from "@/routes"

export default function WorkflowTabs({
	active,
}: {
	active: "allocate" | "replace" | "duplicates"
}) {
	const defaultFilterStartDate = useDefaultFilterStartDate()
	const defaultFilterEndDateToday = useDefaultFilterEndDateToday()

	return (
		<TabNav
			label="Workflow views"
			items={[
				{
					label: "Allocate to Records",
					href: pathAllocator({
						start_date: defaultFilterStartDate ?? undefined,
						end_date: defaultFilterEndDateToday
							? DateTime.now().toFormat("yyyy-MM-dd")
							: undefined,
					}),
					active: active === "allocate",
				},
				{
					label: "Fix Duplicates",
					href: pathAllocatorDuplicates(),
					active: active === "duplicates",
				},
				{
					label: "Replace Pending",
					href: pathAllocatorPending(),
					active: active === "replace",
				},
			]}
		/>
	)
}
