"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import DateField from "@/components/form/date-field"
import { FormField } from "@/components/form/field"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useSettings } from "@/hooks/use-settings"
import { updateSettings } from "@/logic/settings"

export default function SettingsPage() {
	const settings = useSettings()
	const [startDate, setStartDate] = useState("")
	const [endDateToday, setEndDateToday] = useState(false)
	const [comparisonMonths, setComparisonMonths] = useState("3")
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		if (settings) {
			setStartDate(settings.default_filter_start_date ?? "")
			setEndDateToday(settings.default_filter_end_date_today)
			setComparisonMonths(String(settings.dashboard_comparison_months))
		}
	}, [settings])

	const saved = settings?.default_filter_start_date ?? ""
	const changed =
		settings !== undefined &&
		(startDate !== saved || endDateToday !== settings.default_filter_end_date_today)
	const changedComparison =
		settings !== undefined && Number(comparisonMonths) !== settings.dashboard_comparison_months
	const handleSaveFilters = async () => {
		if (!settings) return
		setSaving(true)
		try {
			await updateSettings({
				default_filter_start_date: startDate || null,
				default_filter_end_date_today: endDateToday,
				dashboard_comparison_months: settings.dashboard_comparison_months,
			})
			toast.success("Default filters saved.")
		} catch (cause) {
			toast.error(cause instanceof Error ? cause.message : "Could not save settings.")
		} finally {
			setSaving(false)
		}
	}
	const handleSaveComparison = async () => {
		if (!settings) return
		setSaving(true)
		try {
			await updateSettings({
				default_filter_start_date: settings.default_filter_start_date,
				default_filter_end_date_today: settings.default_filter_end_date_today,
				dashboard_comparison_months: Number(comparisonMonths),
			})
			toast.success("Dashboard analytics settings saved.")
		} catch (cause) {
			toast.error(cause instanceof Error ? cause.message : "Could not save settings.")
		} finally {
			setSaving(false)
		}
	}

	return (
		<PageContent>
			<PageHeader
				title="Settings"
				subtitle="Choose how Finpoint opens your everyday workspaces and compares dashboard activity."
				description="Preferences"
				icon="lucide:settings-2"
			/>

			<Card className="max-w-3xl overflow-hidden">
				<CardHeader className="border-b">
					<CardTitle>Default filters</CardTitle>
					<CardDescription>
						Choose the date range used when Records and Allocator open. Leave the start
						date empty and keep today's end date off to show everything by default.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{settings === undefined ? (
						<div className="grid gap-2">
							<Skeleton className="h-4 w-36" />
							<Skeleton className="h-9 w-full max-w-xs" />
							<Skeleton className="h-3 w-full max-w-md" />
						</div>
					) : (
						<div className="grid max-w-md gap-5">
							<DateField
								id="default_filter_start_date"
								label="Default filter start date"
								description="Leave empty to include Records and Statements from any earlier date."
								value={startDate}
								placeholder="No default start date"
								onChange={setStartDate}
							/>
							<FormField
								id="default_filter_end_date"
								label="Default filter end date"
								description="Choose Today to keep future-dated Records and Statements out of the default view."
							>
								<Select
									value={endDateToday ? "today" : "none"}
									onValueChange={value => setEndDateToday(value === "today")}
								>
									<SelectTrigger id="default_filter_end_date" className="w-full">
										<span className="flex min-w-0 items-center gap-1.5">
											<IconifyIcon icon="lucide:calendar" />
											<SelectValue />
										</span>
									</SelectTrigger>
									<SelectContent align="start" variant="filter">
										<SelectGroup>
											<SelectItem value="none">
												No default end date
											</SelectItem>
											<SelectItem value="today">Today</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormField>
						</div>
					)}
				</CardContent>
				<CardFooter className="justify-end border-t bg-muted/20">
					<Button
						type="button"
						disabled={!changed || saving}
						onClick={() => void handleSaveFilters()}
					>
						{saving ? "Saving…" : "Save default filters"}
					</Button>
				</CardFooter>
			</Card>

			<Card className="max-w-3xl overflow-hidden">
				<CardHeader className="border-b">
					<CardTitle>Dashboard analytics</CardTitle>
					<CardDescription>
						Choose how many earlier months the dashboard uses to compare income,
						spending and category trends.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{settings === undefined ? (
						<div className="grid gap-2">
							<Skeleton className="h-4 w-36" />
							<Skeleton className="h-8 w-56" />
							<Skeleton className="h-7 w-24" />
						</div>
					) : (
						<div className="grid max-w-md gap-5">
							<FormField
								id="dashboard_comparison_preset"
								label="Compare against previous months"
								description="Choose a common period or enter any whole number from 1 to 24."
							>
								<ToggleGroup
									id="dashboard_comparison_preset"
									type="single"
									value={
										["1", "3", "6", "12"].includes(comparisonMonths)
											? comparisonMonths
											: ""
									}
									onValueChange={value => {
										if (value) setComparisonMonths(value)
									}}
									aria-label="Dashboard comparison period"
								>
									{[1, 3, 6, 12].map(months => (
										<ToggleGroupItem key={months} value={String(months)}>
											{months} {months === 1 ? "month" : "months"}
										</ToggleGroupItem>
									))}
								</ToggleGroup>
							</FormField>
							<FormField
								id="dashboard_comparison_months"
								label="Custom number of months"
								description="The dashboard compares the selected month with this many months before it."
							>
								<Input
									id="dashboard_comparison_months"
									className="max-w-28"
									type="number"
									min={1}
									max={24}
									step={1}
									value={comparisonMonths}
									onChange={event => setComparisonMonths(event.target.value)}
								/>
							</FormField>
						</div>
					)}
				</CardContent>
				<CardFooter className="justify-end border-t bg-muted/20">
					<Button
						type="button"
						disabled={!changedComparison || saving || settings === undefined}
						onClick={() => void handleSaveComparison()}
					>
						{saving ? "Saving…" : "Save dashboard settings"}
					</Button>
				</CardFooter>
			</Card>
		</PageContent>
	)
}
