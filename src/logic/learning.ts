import { readLearningValue, readLearningWorkspace, updateLearningValue } from "@/data/learning"
import { guideChapters } from "@/lib/guide"
import { isPendingRecord, tallyAllocations } from "@/logic/pending"
import { listStatements } from "@/logic/statements"

type LearningState = {
	dismissed: boolean
	workspaceUsed: boolean
	reviewed: string[]
	videoFrame: number
	lastImportAt: string | null
	lastRecordId: string | null
	reviewedMonth: string | null
	backupRequestedAt: string | null
	backupLocatedAt: string | null
}

const emptyState = (): LearningState => ({
	dismissed: false,
	workspaceUsed: false,
	reviewed: [],
	videoFrame: 0,
	lastImportAt: null,
	lastRecordId: null,
	reviewedMonth: null,
	backupRequestedAt: null,
	backupLocatedAt: null,
})

function parseState(value: string | undefined): LearningState {
	if (!value) return emptyState()
	try {
		const raw = JSON.parse(value)
		const state = emptyState()
		state.dismissed = raw.dismissed === true
		state.workspaceUsed = raw.workspaceUsed === true
		state.videoFrame =
			Number.isSafeInteger(raw.videoFrame) && raw.videoFrame >= 0 ? raw.videoFrame : 0
		for (const key of [
			"lastImportAt",
			"lastRecordId",
			"reviewedMonth",
			"backupRequestedAt",
			"backupLocatedAt",
		] as const)
			state[key] = typeof raw[key] === "string" ? raw[key] : null
		state.reviewed = guideChapters
			.filter(topic => Array.isArray(raw.reviewed) && raw.reviewed.includes(topic.id))
			.map(topic => topic.id)
		return state
	} catch {
		return emptyState()
	}
}

export async function getLearning() {
	return parseState(await readLearningValue("guide-v1"))
}

async function updateLearning(update: (state: LearningState) => LearningState) {
	await updateLearningValue("guide-v1", value => JSON.stringify(update(parseState(value))))
}

export async function getLearningOverview() {
	const learning = await getLearning()
	const { record, allocations, pendingStatements, ...workspace } = await readLearningWorkspace(
		learning.lastRecordId,
	)
	const tally = tallyAllocations(allocations, pendingStatements).get(record?.id ?? "")
	return {
		...workspace,
		recordStatus: !learning.lastRecordId
			? "not-started"
			: !record
				? "missing"
				: isPendingRecord(record.amount, tally)
					? "pending"
					: "complete",
		learning,
		eligible:
			workspace.ready &&
			!learning.dismissed &&
			!learning.workspaceUsed &&
			workspace.accounts + workspace.statements + workspace.records + workspace.budgets === 0,
	}
}

export async function dismissWelcome() {
	await updateLearning(state => ({ ...state, dismissed: true }))
}
export async function markWorkspaceUsed() {
	await updateLearning(state => ({ ...state, workspaceUsed: true }))
}
export async function markGuideReviewed(id: string) {
	if (!guideChapters.some(topic => topic.id === id)) return
	await updateLearning(state => ({ ...state, reviewed: [...new Set([...state.reviewed, id])] }))
}
export async function saveVideoPosition(frame: number) {
	if (!Number.isSafeInteger(frame) || frame < 0) return
	await updateLearning(state => ({ ...state, videoFrame: frame }))
}
export async function trackImport(count: number) {
	if (count > 0)
		await updateLearning(state => ({
			...state,
			lastImportAt: new Date().toISOString(),
			workspaceUsed: true,
		}))
}
export async function trackRecordSaved(id: string) {
	await updateLearning(state => ({ ...state, lastRecordId: id, workspaceUsed: true }))
}
export async function confirmMonthReviewed(month: string) {
	if (/^\d{4}-\d{2}$/.test(month))
		await updateLearning(state => ({ ...state, reviewedMonth: month }))
}
export async function trackBackupRequested() {
	await updateLearning(state => ({
		...state,
		backupRequestedAt: new Date().toISOString(),
		backupLocatedAt: null,
	}))
}
export async function confirmBackupLocated() {
	await updateLearning(state =>
		state.backupRequestedAt ? { ...state, backupLocatedAt: new Date().toISOString() } : state,
	)
}
export async function getEmptyGuideContext() {
	const [workspace, remaining] = await Promise.all([
		readLearningWorkspace(null),
		listStatements({ is_allocable: "true" }),
	])
	return {
		statements: workspace.statements,
		records: workspace.records,
		remaining: remaining.length,
	}
}
