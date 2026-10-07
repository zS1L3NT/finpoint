"use client"

import { useLiveQuery } from "dexie-react-hooks"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { ContextHelp } from "@/components/help/context-help"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"
import { getLearning, resetPracticeProgress, savePracticeProgress } from "@/logic/learning"
import {
	getPracticeLesson,
	initialPractice,
	type PracticeSnapshot,
	practiceLessons,
	practiceResult,
	savePractice,
} from "@/logic/practice"
import { type FieldErrors, ValidationError } from "@/logic/validate"
import { pathHelpPractice, practiceReturnPath } from "@/routes"

export default function PracticePage() {
	const params = useSearchParams()
	const lesson = getPracticeLesson(params.get("lesson"))
	const returnTo = practiceReturnPath(params.get("return_to"))
	const learning = useLiveQuery(getLearning, [])
	return (
		<PageContent>
			{learning && (
				<Practice
					key={lesson.id}
					lesson={lesson}
					initial={learning.practice[lesson.id] ?? initialPractice(lesson.id)}
					returnTo={returnTo}
				/>
			)}
		</PageContent>
	)
}

function Practice({
	lesson,
	initial,
	returnTo,
}: {
	lesson: ReturnType<typeof getPracticeLesson>
	initial: PracticeSnapshot
	returnTo: string
}) {
	const router = useRouter()
	const [state, setState] = useState(initial)
	const [errors, setErrors] = useState<FieldErrors>({})
	const [busy, setBusy] = useState(false)
	const [notice, setNotice] = useState("")
	const result = practiceResult(lesson.id, state)
	const finished = !!result?.complete && (lesson.id !== "split" || state.stage === 1)
	const recordTitle =
		lesson.id === "repayment"
			? "Shared dinner"
			: lesson.id === "split"
				? state.stage === 0
					? "Groceries"
					: "Gift"
				: "Lunch"
	const nextLesson = practiceLessons[practiceLessons.findIndex(item => item.id === lesson.id) + 1]

	async function persist(next: PracticeSnapshot, complete = false) {
		setBusy(true)
		try {
			await savePracticeProgress(lesson.id, next, complete)
			setState(next)
			return true
		} catch {
			setNotice(
				"Could not remember progress in this browser. Your financial data is unchanged. Try again.",
			)
			return false
		} finally {
			setBusy(false)
		}
	}

	async function save() {
		setErrors({})
		setNotice("")
		try {
			const next = savePractice(lesson.id, state)
			const nextResult = practiceResult(lesson.id, next)
			if (await persist(next, !!nextResult?.complete))
				setNotice(
					nextResult?.pending
						? "Saved in practice. The Record is Pending because its amount and Allocation total differ."
						: "Saved in practice. Check the totals below.",
				)
		} catch (cause) {
			if (cause instanceof ValidationError) setErrors(cause.errors)
			else setNotice("Could not save the sample. Try again.")
		}
	}

	return (
		<>
			<PageHeader
				title={lesson.title}
				description="Practice · sample data"
				icon="lucide:graduation-cap"
				subtitle="This is a simplified exercise, using fictional amounts. It does not add or edit your financial Records. Save the sample or pause to remember your progress."
				actions={
					<Button
						variant="outline"
						size="lg"
						className="min-h-11"
						disabled={busy}
						onClick={async () => {
							if (await persist(state)) router.push(returnTo)
						}}
					>
						Pause & exit
					</Button>
				}
			/>
			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)]">
				<div className="flex min-w-0 flex-col gap-5">
					<Card>
						<CardHeader>
							<CardTitle>
								{lesson.id === "split"
									? `Part ${state.stage + 1} of 2: ${recordTitle}`
									: "Your task"}
							</CardTitle>
							<CardDescription className="text-sm leading-6">
								{lesson.task}
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-4 text-sm">
							<div className="rounded-lg border bg-muted/30 p-4">
								<p className="mb-2 font-medium">Sample Statements</p>
								<ul className="space-y-2">
									{lesson.amounts.map((amount, index) => (
										<li
											key={lesson.labels[index]}
											className="flex justify-between gap-3"
										>
											<span>{lesson.labels[index]}</span>
											<span className="font-medium tabular-nums">
												{formatCurrency(amount)}
											</span>
										</li>
									))}
								</ul>
								{lesson.id === "split" && state.stage === 1 && (
									<p className="mt-3 text-muted-foreground">
										Groceries already uses −$60. Only −$20 remains for Gift.
									</p>
								)}
							</div>
							<form
								onSubmit={event => {
									event.preventDefault()
									void save()
								}}
								className="flex flex-col gap-5"
							>
								<p className="text-sm leading-6">
									<strong>Statement:</strong> what the bank says moved.{" "}
									<strong>Allocation:</strong> the part assigned to this Record.{" "}
									<strong>Record:</strong> your explanation.
								</p>
								<ContextHelp
									topic={lesson.topic}
									label="Explain these amounts"
									variant="inline"
								/>
								<FieldGroup>
									{state.draft.map((value, index) => (
										<Field
											key={`amount${index}`}
											data-invalid={!!errors[`amount${index}`]?.length}
										>
											<FieldLabel
												htmlFor={`practice-amount-${index}`}
												className="text-sm"
											>
												{index === 0
													? `${recordTitle} Record · Paid`
													: `${lesson.labels[index - 1]} Allocation · ${(lesson.amounts[index - 1] ?? 0) > 0 ? "Received" : "Paid"}`}{" "}
												amount ($)
											</FieldLabel>
											<Input
												id={`practice-amount-${index}`}
												inputMode="decimal"
												autoComplete="off"
												value={value}
												disabled={busy}
												className="min-h-11 text-base"
												aria-invalid={!!errors[`amount${index}`]?.length}
												aria-describedby={
													errors[`amount${index}`]?.length
														? `practice-error-${index}`
														: "practice-amount-hint"
												}
												onChange={event => {
													const draft = [...state.draft]
													draft[index] = event.target.value
													setState({ ...state, draft })
													setErrors(current => ({
														...current,
														[`amount${index}`]: [],
													}))
												}}
											/>
											{errors[`amount${index}`]?.length ? (
												<FieldError id={`practice-error-${index}`}>
													{errors[`amount${index}`]?.join(" ")}
												</FieldError>
											) : null}
										</Field>
									))}
								</FieldGroup>
								<p
									id="practice-amount-hint"
									className="text-sm text-muted-foreground"
								>
									Enter positive values. Paid becomes negative; Received becomes
									positive. Saving an amount mismatch is allowed and leaves the
									Record Pending.
								</p>
								<Button
									type="submit"
									size="lg"
									className="min-h-11 sm:w-fit"
									disabled={busy}
								>
									{busy ? "Remembering…" : "Save sample Record"}
								</Button>
							</form>
						</CardContent>
					</Card>
					<div role="status" aria-live="polite" className="text-sm leading-6">
						{notice}
					</div>
					{result && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between gap-2">
									Last saved sample
									<Badge variant="outline">
										{result.pending ? "Pending" : "Tallies"}
									</Badge>
								</CardTitle>
								<CardDescription className="text-sm">
									These are saved values. Edit above and save again to update
									them.
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-4 text-sm">
								<dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 tabular-nums">
									<dt>Record amount</dt>
									<dd>{formatCurrency(result.record)}</dd>
									<dt>Allocation total</dt>
									<dd>{formatCurrency(result.allocated)}</dd>
									<dt>Difference</dt>
									<dd>{formatCurrency(result.difference)}</dd>
									{result.remaining.map((amount, index) => (
										<div key={lesson.labels[index]} className="contents">
											<dt>{lesson.labels[index]} remaining</dt>
											<dd>{formatCurrency(amount)}</dd>
										</div>
									))}
								</dl>
								{lesson.id === "pending" && !state.sawPending && (
									<p>
										First save Record $10 and Allocation $12 to observe the
										Pending example. Then fix the Record to $12.
									</p>
								)}
								{result.exactPendingExample && (
									<p>
										A −$10 Record and −$12 Allocation differ by $2. In this
										sample, Lunch cost $12 and the Statement shows $12 paid.
										Change the Record to Paid $12 and save again.
									</p>
								)}
								{result.pending && !result.exactPendingExample && (
									<p>
										Compare the explanation with the allocated bank amounts.
										Correct the value that does not match the facts.
									</p>
								)}
								{!result.pending && !result.complete && (
									<p>
										The Record tallies, but this lesson also needs the stated
										amount and the expected Statement remainder. Check the task
										above.
									</p>
								)}
								{result.complete && lesson.id === "split" && state.stage === 0 && (
									<>
										<p>
											Groceries is complete. There is −$20 left from the
											supermarket Statement for Gift.
										</p>
										<Button
											size="lg"
											className="min-h-11 sm:w-fit"
											disabled={busy}
											onClick={() => {
												setNotice("")
												setErrors({})
												void persist({
													draft: ["20", "20"],
													saved: null,
													stage: 1,
													sawPending: false,
												})
											}}
										>
											Next: explain the $20 Gift
										</Button>
									</>
								)}
								{finished && (
									<>
										<p className="font-medium">
											Lesson completed.{" "}
											{lesson.id === "repayment"
												? "−$90 + $60 = −$30. The repayment is part of the dinner explanation."
												: lesson.id === "split"
													? "−$60 + −$20 = −$80. Both purchases explain the one Statement."
													: "−$12 allocated matches the −$12 Record. The Statement has $0 remaining."}
										</p>
										<Button asChild size="lg" className="min-h-11 sm:w-fit">
											<Link
												href={
													nextLesson
														? pathHelpPractice(nextLesson.id, returnTo)
														: returnTo
												}
											>
												{nextLesson
													? `Next: ${nextLesson.title}`
													: "Return to the previous page"}
											</Link>
										</Button>
									</>
								)}
							</CardContent>
						</Card>
					)}
				</div>
				<aside className="flex min-w-0 flex-col gap-5">
					<Card>
						<CardHeader>
							<CardTitle>Keep the three amounts separate</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm leading-6">
							<p>
								<strong>Statement:</strong> what the bank says moved.
							</p>
							<p>
								<strong>Allocation:</strong> how much of that movement explains this
								Record.
							</p>
							<p>
								<strong>Record:</strong> the activity you are explaining.
							</p>
							<p>
								A Record is complete when it has at least one Allocation, its amount
								equals their total, and none of its Statements are Pending. These
								samples use confirmed Statements. A Statement can still have a
								remainder for another Record.
							</p>
							<ContextHelp
								topic={lesson.topic}
								label="Explain this lesson"
								variant="inline"
							/>
						</CardContent>
					</Card>
					<section>
						<h3 className="mb-2 text-sm font-medium">Practice lessons</h3>
						<ul className="space-y-1">
							{practiceLessons.map(item => (
								<li key={item.id}>
									<Link
										href={pathHelpPractice(item.id, returnTo)}
										aria-current={item.id === lesson.id ? "page" : undefined}
										className="block rounded-md px-3 py-3 text-sm hover:bg-muted aria-[current=page]:bg-muted"
									>
										{item.title}
									</Link>
								</li>
							))}
						</ul>
					</section>
					<Button
						variant="outline"
						size="lg"
						className="min-h-11"
						disabled={busy}
						onClick={async () => {
							setBusy(true)
							try {
								await resetPracticeProgress(lesson.id)
								setState(initialPractice(lesson.id))
								setErrors({})
								setNotice(
									"This sample lesson was restarted. Your financial data is unchanged.",
								)
							} catch {
								setNotice("Could not restart this lesson. Try again.")
							} finally {
								setBusy(false)
							}
						}}
					>
						Restart this sample lesson
					</Button>
				</aside>
			</div>
		</>
	)
}
