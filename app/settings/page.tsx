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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useSettings } from "@/hooks/use-settings"
import { pluralize } from "@/lib/utils"
import { updateSettings } from "@/logic/settings"
import { RULE_FIELDS } from "@/logic/statement-rules"
import {
	DEFAULT_WEIGHTS,
	type SuggestionAccuracy,
	suggestionAccuracy,
	type Weights,
} from "@/logic/suggestions"
import type { RuleField } from "@/types"

/** What the learned weights say about this workspace, in the user's words. */
function learnedSignals(field: RuleField, w: Weights) {
	const signals = [
		w.price > DEFAULT_WEIGHTS.price && "exact amounts",
		w.hour > DEFAULT_WEIGHTS.hour && "the time you enter",
		field !== "title" && w.title > DEFAULT_WEIGHTS.title && "the Title more than the bank text",
		field !== "title" && w.title < DEFAULT_WEIGHTS.title && "the bank text more than the Title",
		w.halfLife < DEFAULT_WEIGHTS.halfLife && `mostly the last ${w.halfLife} days`,
		w.halfLife > DEFAULT_WEIGHTS.halfLife && "your whole history",
		w.threshold > DEFAULT_WEIGHTS.threshold && "only close merchant matches",
		w.threshold < DEFAULT_WEIGHTS.threshold && "loose merchant matches",
		w.shape > DEFAULT_WEIGHTS.shape && "similar kinds of payment when the merchant is new",
	].filter(Boolean)
	return signals.length
		? `Learned to weigh ${signals.join(", ")}.`
		: "Nothing beyond similar bank text and the Title yet."
}

export default function SettingsPage() {
	const settings = useSettings()
	const [startDate, setStartDate] = useState("")
	const [endDateToday, setEndDateToday] = useState(false)
	const [saving, setSaving] = useState(false)
	const [accuracy, setAccuracy] = useState<SuggestionAccuracy | null>(null)
	const [measuring, setMeasuring] = useState(false)

	useEffect(() => {
		if (settings) {
			setStartDate(settings.default_filter_start_date ?? "")
			setEndDateToday(settings.default_filter_end_date_today)
		}
	}, [settings])

	const saved = settings?.default_filter_start_date ?? ""
	const changed =
		settings !== undefined &&
		(startDate !== saved || endDateToday !== settings.default_filter_end_date_today)
	const handleSaveFilters = async () => {
		if (!settings) return
		setSaving(true)
		try {
			await updateSettings({
				default_filter_start_date: startDate || null,
				default_filter_end_date_today: endDateToday,
			})
			toast.success("Default filters saved.")
		} catch (cause) {
			toast.error(cause instanceof Error ? cause.message : "Could not save settings.")
		} finally {
			setSaving(false)
		}
	}

	const handleMeasure = async () => {
		setMeasuring(true)
		try {
			setAccuracy(await suggestionAccuracy())
		} catch {
			toast.error("Could not measure suggestions.")
		} finally {
			setMeasuring(false)
		}
	}

	return (
		<PageContent>
			<PageHeader
				title="Settings"
				subtitle="Choose how Finpoint opens your everyday workspaces."
				description="Preferences"
				icon="lucide:settings-2"
			/>

			<Card className="max-w-3xl overflow-hidden">
				<CardHeader className="border-b">
					<CardTitle>Default filters</CardTitle>
					<CardDescription>
						Choose the date range used when Records and Allocate to Records open. Leave
						the start date empty and keep today's end date off to show everything by
						default.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{settings === undefined ? null : (
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
					<CardTitle>Suggestion accuracy</CardTitle>
					<CardDescription>
						Record suggestions are learned on this device from your past Records,
						including which signals matter for you. To measure them, Finpoint learns
						only from your older Records, then predicts your newest third one by one
						from what existed before each, as if you were creating it with its Title and
						time filled in, and checks the first suggestion against what you chose.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{accuracy ? (
						<dl className="grid max-w-xl grid-cols-[auto_auto_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 text-sm">
							{accuracy.fields.map(({ field, hits, total, unwanted, weights }) => (
								<div key={field} className="contents">
									<dt className="text-muted-foreground">
										{RULE_FIELDS.find(f => f.value === field)?.label}
									</dt>
									<dd className="font-medium tabular-nums">
										{total ? `${Math.round((hits / total) * 100)}%` : "–"}
									</dd>
									<dd className="text-xs text-muted-foreground tabular-nums">
										{hits} of {pluralize(total, "Record")}
										{unwanted
											? `; offered ${pluralize(unwanted, "time")} when you left it empty`
											: ""}
									</dd>
									<dd className="col-span-3 mb-2 text-xs text-muted-foreground">
										{learnedSignals(field, weights)}
									</dd>
								</div>
							))}
						</dl>
					) : (
						<p className="text-sm text-muted-foreground">
							The first suggestion for each field is scored against Records with
							allocated Statements.
						</p>
					)}
				</CardContent>
				<CardFooter className="justify-end border-t bg-muted/20">
					<Button type="button" disabled={measuring} onClick={() => void handleMeasure()}>
						{measuring ? "Measuring…" : accuracy ? "Measure again" : "Measure accuracy"}
					</Button>
				</CardFooter>
			</Card>
		</PageContent>
	)
}
