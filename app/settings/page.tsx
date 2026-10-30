"use client"

import { useLiveQuery } from "dexie-react-hooks"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import DateField from "@/components/form/date-field"
import { FormField } from "@/components/form/field"
import { ruleValueLabel } from "@/components/form/rule-suggestions"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
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
import { cn, pluralize } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { updateSettings } from "@/logic/settings"
import { RULE_FIELDS } from "@/logic/statement-rules"
import {
	DEFAULT_WEIGHTS,
	type SuggestionAccuracy,
	suggestionAccuracy,
	type Weights,
} from "@/logic/suggestions"
import { pathStatementRules } from "@/routes"
import type { RuleField } from "@/types"

/** What the learned weights say about this workspace, in the user's words. */
function learnedSignals(field: RuleField, w: Weights) {
	return [
		w.price > DEFAULT_WEIGHTS.price && "Exact amounts",
		w.hour > DEFAULT_WEIGHTS.hour && "Time of day",
		field !== "title" && w.title > DEFAULT_WEIGHTS.title && "Title over bank text",
		field !== "title" && w.title < DEFAULT_WEIGHTS.title && "Bank text over Title",
		w.halfLife < DEFAULT_WEIGHTS.halfLife && `Last ${w.halfLife} days`,
		w.halfLife > DEFAULT_WEIGHTS.halfLife && "Whole history",
		w.threshold > DEFAULT_WEIGHTS.threshold && "Close merchant matches only",
		w.threshold < DEFAULT_WEIGHTS.threshold && "Loose merchant matches",
		w.shape > DEFAULT_WEIGHTS.shape && "Similar payments for new merchants",
	].filter(signal => typeof signal === "string")
}

export default function SettingsPage() {
	const settings = useSettings()
	const categories = useLiveQuery(() => listCategories(), []) ?? []
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
						How often the first suggestion in New Record matches what you chose, and
						what Finpoint has learned about how you record. Everything is learned on
						this device.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-5">
					{accuracy ? (
						<>
							<p className="text-sm text-muted-foreground">
								Replayed on your newest {pluralize(accuracy.records, "Record")}, the
								first suggestion was right{" "}
								<span className="font-medium text-foreground tabular-nums">
									{pluralize(
										accuracy.fields.reduce((sum, f) => sum + f.hits, 0),
										"time",
									)}
								</span>
								: that many fields you would not have typed.
							</p>
							<ul className="grid gap-5">
								{accuracy.fields.map(
									({ field, hits, total, unwanted, misses, weights }) => {
										const label = RULE_FIELDS.find(
											f => f.value === field,
										)?.label
										const tenths = total ? Math.round((hits / total) * 10) : 0
										const value = (id: string) =>
											ruleValueLabel(field, id, categories, undefined)
										const signals = learnedSignals(field, weights)
										return (
											<li key={field} className="grid gap-2">
												<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
													<span className="w-20 text-sm font-medium">
														{label}
													</span>
													<span
														className="flex gap-0.5"
														role="img"
														aria-label={`About ${tenths} in 10 right`}
													>
														{Array.from({ length: 10 }, (_, i) => (
															<span
																key={i}
																className={cn(
																	"h-3 w-2 rounded-[2px]",
																	i < tenths
																		? "bg-foreground"
																		: "bg-muted",
																)}
															/>
														))}
													</span>
													<span className="text-sm font-medium tabular-nums">
														{total
															? `${Math.round((hits / total) * 100)}%`
															: "–"}
													</span>
													<span className="text-xs text-muted-foreground tabular-nums">
														{hits} of {pluralize(total, "Record")}
													</span>
												</div>
												<div className="grid gap-1.5 text-xs text-muted-foreground @md/page:pl-23">
													<p className="flex flex-wrap items-center gap-1">
														{signals.length ? (
															<>
																Learned to weigh
																{signals.map(signal => (
																	<Badge
																		key={signal}
																		variant="secondary"
																	>
																		{signal}
																	</Badge>
																))}
															</>
														) : (
															"Nothing beyond similar bank text and the Title yet."
														)}
													</p>
													{misses.map(miss => (
														<p key={`${miss.offered}:${miss.actual}`}>
															Suggested{" "}
															<span className="text-foreground">
																{value(miss.offered)}
															</span>{" "}
															when you chose{" "}
															<span className="text-foreground">
																{value(miss.actual)}
															</span>
															, {pluralize(miss.count, "time")}.
														</p>
													))}
													{unwanted ? (
														<p>
															Offered {pluralize(unwanted, "time")}{" "}
															when you left it empty.
														</p>
													) : null}
												</div>
											</li>
										)
									},
								)}
							</ul>
							{accuracy.fields.some(f => f.misses.length) ? (
								<p className="text-xs text-muted-foreground">
									Mix-ups that keep coming back are a good place for a{" "}
									<Link
										href={pathStatementRules()}
										className="underline underline-offset-2"
									>
										Statement rule
									</Link>
									, which always fills in the same values.
								</p>
							) : null}
						</>
					) : (
						<p className="text-sm text-muted-foreground">
							Finpoint learns only from your older Records, then replays your newest
							third one by one from what existed before each, as if you were creating
							it with its Title and time filled in.
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
