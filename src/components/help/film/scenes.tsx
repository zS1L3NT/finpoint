import {
	ArrowDownUp,
	BadgeCheck,
	CalendarRange,
	ChartColumn,
	CircleDollarSign,
	CloudUpload,
	Download,
	FileSearch,
	FileSpreadsheet,
	FolderOpen,
	Gift,
	HandCoins,
	HardDrive,
	House,
	Import,
	Laptop,
	ListFilter,
	Lock,
	type LucideIcon,
	MousePointerClick,
	PiggyBank,
	Plane,
	RefreshCw,
	Repeat,
	RotateCcw,
	Search,
	ShoppingBasket,
	Smartphone,
	Split,
	Tags,
	Target,
	TrendingUp,
	Upload,
	Users,
	Utensils,
	Wallet,
} from "lucide-react"
import { createContext, type FC, type ReactNode, useContext } from "react"
import { interpolate, useCurrentFrame } from "remotion"
import {
	AllocationTag,
	At,
	BrowserWindow,
	Card,
	CheckMark,
	Chip,
	FileDoc,
	Flow,
	IconTile,
	Kicker,
	Meter,
	RecordCard,
	StatementCard,
	Status,
	Tile,
} from "./kit"
import { CountUp, Pop, Rise, Roll, useCue, useProgress, useReduced, useSpring } from "./motion"
import { alpha, color, font, money } from "./theme"

export type Beat = FC

/** The frame a beat's visuals may start on (after the chapter's title card for the first beat). */
export const BeatStart = createContext(0)

/** When `word` is spoken, or `fallback` frames into the beat if the narration never says it. */
function useAt(word: string, fallback: number, options: { nth?: number; offset?: number } = {}) {
	const start = useContext(BeatStart)
	return Math.max(start, useCue(word, { ...options, fallback: start + fallback }))
}

const big = { fontSize: 44, fontWeight: 750, letterSpacing: "-0.03em" } as const

function Mark({
	children,
	tint = color.pending,
	at,
}: {
	children: ReactNode
	tint?: string
	at: number
}) {
	return (
		<Pop at={at}>
			<div
				style={{
					width: 58,
					height: 58,
					borderRadius: 99,
					display: "grid",
					placeItems: "center",
					background: tint,
					color: color.night,
					fontSize: 34,
					fontWeight: 800,
					boxShadow: `0 0 30px ${alpha(tint, 0.6)}`,
				}}
			>
				{children}
			</div>
		</Pop>
	)
}

function ChecklistRow({ label, at }: { label: string; at: number }) {
	const lit = useProgress(at, 14)
	return (
		<Rise at={at - 10} x={-20} y={0}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 18,
					fontSize: 30,
					fontWeight: 600,
				}}
			>
				<CheckMark at={at} size={52} />
				<span style={{ opacity: 0.45 + 0.55 * lit }}>{label}</span>
			</div>
		</Rise>
	)
}

/** Statement → Allocation → Record, the shape every other diagram builds on. */
function LunchFlow({
	statementAt,
	allocationAt,
	recordAt,
	merchant = "Kopi & Co",
	settled,
}: {
	statementAt: number
	allocationAt: number
	recordAt: number
	merchant?: string
	settled?: number
}) {
	const settle = useProgress(settled ?? Number.MAX_SAFE_INTEGER, 30)
	return (
		<>
			<Flow from={{ x: 300, y: 140 }} to={{ x: 520, y: 380 }} at={allocationAt} />
			<At x={0} y={40} w={470}>
				<Rise at={statementAt}>
					<StatementCard
						title={merchant}
						meta="DBS · 3 Oct"
						amount={-12}
						glow={0.3}
						footer={
							settled !== undefined && (
								<div
									style={{
										padding: "0 26px 22px",
										display: "flex",
										alignItems: "center",
										gap: 16,
										fontSize: 21,
										color: color.dim,
									}}
								>
									Remaining
									<Meter
										value={1 - settle}
										tint={color.statement}
										style={{ flex: 1 }}
										height={10}
									/>
									<Roll
										at={settled}
										before={<b style={font.numbers}>−$12</b>}
										after={
											<b style={{ ...font.numbers, color: color.record }}>
												$0
											</b>
										}
									/>
								</div>
							)
						}
					/>
				</Rise>
			</At>
			<At x={410} y={260} w={0}>
				<AllocationTag amount="−$12" at={allocationAt + 10} />
			</At>
			<At x={482} y={300} w={470}>
				<Rise at={recordAt}>
					<RecordCard
						title="Lunch"
						amount={-12}
						icon={Utensils}
						glow={0.3}
						chips={<Chip tint={color.pink}>Food</Chip>}
						status={
							settled !== undefined && <Status pending={false} at={settled + 6} />
						}
					/>
				</Rise>
			</At>
		</>
	)
}

// ─── 01 · What does Finpoint help me do? ────────────────────────────────────────────────

function StartProblem() {
	const bank = useAt("bank", 0)
	const really = useAt("really", 30)
	const market = useAt("supermarket", 70)
	const dinner = useAt("dinner", 110)
	const rows: [string, string, number, number, ReactNode][] = [
		[
			"NTUC FAIRPRICE",
			"DBS · 2 Oct",
			-80,
			market,
			<>
				<Chip tint={color.record}>Groceries?</Chip>
				<Chip tint={color.pink}>A gift?</Chip>
			</>,
		],
		[
			"SAKURA DINING",
			"DBS · 4 Oct",
			-90,
			dinner,
			<Chip tint={color.pending}>Friends’ shares?</Chip>,
		],
		[
			"PAYNOW · J TAN",
			"DBS · 5 Oct",
			60,
			dinner + 18,
			<Chip tint={color.pending}>Paid back?</Chip>,
		],
	]
	return (
		<>
			{rows.map(([title, meta, amount, at, chips], index) => (
				<At key={title} x={0} y={index * 168 + 6} w={952}>
					<Rise at={bank + index * 8} x={-40} y={0}>
						<div style={{ display: "flex", alignItems: "center", gap: 24 }}>
							<StatementCard
								title={title}
								meta={meta}
								amount={amount}
								compact
								style={{ width: 560 }}
							/>
							<Mark at={really + index * 6}>?</Mark>
							<Rise
								at={at}
								x={-20}
								y={0}
								style={{ display: "flex", gap: 10, flexWrap: "wrap", width: 280 }}
							>
								{chips}
							</Rise>
						</div>
					</Rise>
				</At>
			))}
		</>
	)
}

function StartHelps() {
	const bank = useAt("bank", 0)
	const explain = useAt("explanations", 40)
	const show = useAt("spending", 80)
	const one = useAt("one", 140)
	const columns: [string, LucideIcon, string, number][] = [
		["Bank activity", Import, color.statement, bank],
		["Your explanations", Tags, color.record, explain],
		["Spending & plans", ChartColumn, color.allocation, show],
	]
	const bars = [0.55, 0.8, 0.4, 0.95, 0.65]
	return (
		<>
			<Flow
				from={{ x: 286, y: 220 }}
				to={{ x: 333, y: 220 }}
				at={explain}
				tint={color.record}
			/>
			<Flow
				from={{ x: 619, y: 220 }}
				to={{ x: 666, y: 220 }}
				at={show}
				tint={color.allocation}
			/>
			{columns.map(([title, icon, tint, at], index) => (
				<At key={title} x={index * 333} y={20} w={286}>
					<Rise at={at}>
						<Card tint={tint} glow={0.2} style={{ padding: 26, height: 400 }}>
							<IconTile icon={icon} tint={tint} />
							<div style={{ fontSize: 30, fontWeight: 700, margin: "20px 0 18px" }}>
								{title}
							</div>
							{index === 0 &&
								[-80, -12, 3000].map((amount, row) => (
									<Rise key={amount} at={at + 8 + row * 6} y={14}>
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												padding: "12px 0",
												borderTop: `1.5px solid ${color.line}`,
												fontSize: 24,
												color: color.dim,
											}}
										>
											<span>Row {row + 1}</span>
											<b style={{ ...font.numbers, color: color.ink }}>
												{money(amount)}
											</b>
										</div>
									</Rise>
								))}
							{index === 1 &&
								["Groceries", "Lunch", "Salary"].map((name, row) => (
									<Rise
										key={name}
										at={at + 8 + row * 6}
										y={14}
										style={{ marginBottom: 10 }}
									>
										<Chip tint={color.record} size={24}>
											{name}
										</Chip>
									</Rise>
								))}
							{index === 2 && (
								<div
									style={{
										display: "flex",
										alignItems: "flex-end",
										gap: 14,
										height: 150,
									}}
								>
									{bars.map((bar, row) => (
										<Bar
											key={bar}
											at={at + 6 + row * 4}
											height={bar * 150}
											tint={tint}
										/>
									))}
								</div>
							)}
						</Card>
					</Rise>
				</At>
			))}
			<At x={0} y={440} w={952} style={{ display: "flex", justifyContent: "center" }}>
				<Rise at={one}>
					<Chip tint={color.record} size={26}>
						Start with one purchase, not every setting
					</Chip>
				</Rise>
			</At>
		</>
	)
}

function Bar({ at, height, tint }: { at: number; height: number; tint: string }) {
	const grow = useSpring(at, { damping: 16 })
	return (
		<div
			style={{
				flex: 1,
				height: height * grow,
				borderRadius: 10,
				background: `linear-gradient(180deg, ${tint}, ${alpha(tint, 0.35)})`,
			}}
		/>
	)
}

function StartExample() {
	return (
		<LunchFlow
			statementAt={useAt("bank", 10)}
			recordAt={useAt("Record", 60)}
			allocationAt={useAt("Allocation", 100)}
		/>
	)
}

// ─── 02 · Statements, Records, Allocations ──────────────────────────────────────────────

function ModelProblem() {
	const rows = useAt("Statements", 0)
	const life = useAt("real-life", 20)
	const match = useAt("match", 40)
	const left = [
		["SUPERMARKET", -80],
		["DINNER", -90],
		["PAYNOW", 60],
	] as const
	const right = [
		["Groceries", ShoppingBasket],
		["Gift", Gift],
		["My dinner share", Users],
	] as const
	const links = [
		[0, 0],
		[0, 1],
		[1, 2],
		[2, 2],
	] as const
	return (
		<>
			{links.map(([from, to], index) => (
				<Flow
					key={`${from}-${to}`}
					from={{ x: 440, y: 92 + from * 150 }}
					to={{ x: 600, y: 92 + to * 150 }}
					at={match + index * 8}
					tint={index % 2 ? color.allocation : color.pending}
				/>
			))}
			<At x={0} y={0}>
				<Rise at={rows}>
					<Kicker tint={color.statement}>Statements</Kicker>
				</Rise>
			</At>
			<At x={600} y={0}>
				<Rise at={life}>
					<Kicker tint={color.record}>Real life</Kicker>
				</Rise>
			</At>
			{left.map(([title, amount], index) => (
				<At key={title} x={0} y={40 + index * 150} w={440}>
					<Rise at={rows + index * 8} x={-30} y={0}>
						<StatementCard title={title} amount={amount} compact meta="Statement" />
					</Rise>
				</At>
			))}
			{right.map(([title, icon], index) => (
				<At key={title} x={600} y={40 + index * 150} w={352}>
					<Rise at={life + index * 8} x={30} y={0}>
						<RecordCard title={title} icon={icon} compact />
					</Rise>
				</At>
			))}
		</>
	)
}

function ModelHelps() {
	const statement = useAt("Statement", 0)
	const record = useAt("Record", 50)
	const allocation = useAt("Allocation", 100)
	const account = useAt("Account", 160)
	const paid = useAt("paid", 220)
	const cards: [string, string, string, LucideIcon, number][] = [
		["Statement", "One account activity entry", color.statement, Import, statement],
		[
			"Allocation",
			"Assigns an amount from a Statement to a Record",
			color.allocation,
			ArrowDownUp,
			allocation,
		],
		["Record", "Your explanation of what happened", color.record, BadgeCheck, record],
	]
	return (
		<>
			{cards.map(([title, body, tint, icon, at], index) => (
				<At key={title} x={index * 324} y={0} w={304}>
					<Rise at={at} y={40}>
						<Card tint={tint} glow={0.35} style={{ padding: 28, height: 300 }}>
							<IconTile icon={icon} tint={tint} size={70} />
							<div
								style={{
									fontSize: 36,
									fontWeight: 750,
									marginTop: 22,
									color: tint,
								}}
							>
								{title}
							</div>
							<div
								style={{
									fontSize: 25,
									lineHeight: 1.35,
									marginTop: 10,
									color: color.dim,
								}}
							>
								{body}
							</div>
						</Card>
					</Rise>
				</At>
			))}
			<At x={0} y={340} w={952} style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
				<Rise at={account}>
					<Chip tint={color.neutral} size={25}>
						Account = where money sits, not your login
					</Chip>
				</Rise>
				<Rise at={paid}>
					<Chip tint={color.spending} size={25}>
						Paid → −$12
					</Chip>
				</Rise>
				<Rise at={paid + 14}>
					<Chip tint={color.income} size={25}>
						Received → +$60
					</Chip>
				</Rise>
			</At>
		</>
	)
}

function ModelCheck() {
	return (
		<>
			<At x={0} y={0} w={420}>
				<Rise at={0}>
					<RecordCard
						title="Lunch"
						amount={-12}
						icon={Utensils}
						status={<Status pending={false} at={useAt("Pending", 90)} />}
					/>
				</Rise>
			</At>
			<At x={0} y={190} w={952} style={{ display: "flex", flexDirection: "column", gap: 26 }}>
				<ChecklistRow label="At least one Allocation" at={useAt("Allocation", 20)} />
				<ChecklistRow
					label="Allocation total equals the Record amount"
					at={useAt("equals", 50)}
				/>
				<ChecklistRow
					label="None of its Statements are Pending"
					at={useAt("Pending", 80)}
				/>
			</At>
		</>
	)
}

function ModelExample() {
	const balance = useAt("Account", 120)
	return (
		<>
			<LunchFlow
				statementAt={useAt("Statement", 0)}
				allocationAt={useAt("Allocation", 30)}
				recordAt={useAt("Lunch", 60)}
			/>
			<At x={0} y={480} w={952} style={{ display: "flex", gap: 14 }}>
				<Rise at={balance}>
					<Chip tint={color.statement}>Account balance</Chip>
				</Rise>
				<Rise at={balance + 10}>
					<span style={{ fontSize: 24, color: color.dim }}>and</span>
				</Rise>
				<Rise at={balance + 16}>
					<Chip tint={color.spending}>Dashboard spending</Chip>
				</Rise>
				<Rise at={balance + 24}>
					<span style={{ fontSize: 24, color: color.dim }}>
						answer different questions
					</span>
				</Rise>
			</At>
		</>
	)
}

// ─── 03 · Start or restore a workspace ──────────────────────────────────────────────────

function WorkspaceProblem() {
	const categories = useAt("Categories", 10)
	const buckets = useAt("buckets", 30)
	const empty = useAt("no", 60)
	return (
		<Rise at={useContext(BeatStart)} y={40}>
			<BrowserWindow url="finpoint.app/statements" style={{ height: 500 }}>
				<div style={{ display: "flex", height: 430 }}>
					<div
						style={{
							width: 280,
							padding: 26,
							borderRight: `1.5px solid ${color.line}`,
							display: "flex",
							flexDirection: "column",
							gap: 12,
						}}
					>
						<Kicker>Starter categories</Kicker>
						{["Food", "Transport", "Bills"].map((name, index) => (
							<Rise key={name} at={categories + index * 5} x={-16} y={0}>
								<Chip tint={color.pink}>{name}</Chip>
							</Rise>
						))}
						<div style={{ height: 8 }} />
						<Kicker>Spending buckets</Kicker>
						{["Daily", "Recurring"].map((name, index) => (
							<Rise key={name} at={buckets + index * 5} x={-16} y={0}>
								<Chip tint={color.allocation}>{name}</Chip>
							</Rise>
						))}
					</div>
					<div style={{ flex: 1, display: "grid", placeItems: "center" }}>
						<Pop at={empty}>
							<div
								style={{
									border: `2.5px dashed ${alpha(color.statement, 0.5)}`,
									borderRadius: 24,
									padding: "40px 48px",
									textAlign: "center",
									color: color.dim,
									fontSize: 28,
								}}
							>
								<Import size={56} color={color.statement} />
								<div style={{ marginTop: 14, color: color.ink, fontWeight: 650 }}>
									No bank activity yet
								</div>
								<div style={{ fontSize: 22, marginTop: 6 }}>
									Statements arrive by import
								</div>
							</div>
						</Pop>
					</div>
				</div>
			</BrowserWindow>
		</Rise>
	)
}

function WorkspaceHelps() {
	const browser = useAt("browser", 0)
	const starter = useAt("starter", 70)
	const learn = useAt("learn", 140)
	const restore = useAt("restore", 180)
	return (
		<>
			<At x={0} y={10} w={560}>
				<Rise at={browser}>
					<BrowserWindow
						url="This browser · this device"
						tint={color.statement}
						style={{ height: 440 }}
					>
						<div
							style={{
								padding: 34,
								display: "flex",
								flexDirection: "column",
								gap: 22,
							}}
						>
							<div style={{ display: "flex", alignItems: "center", gap: 18 }}>
								<IconTile icon={HardDrive} tint={color.statement} size={76} />
								<div>
									<div style={{ fontSize: 30, fontWeight: 700 }}>
										Stored locally
									</div>
									<div style={{ fontSize: 23, color: color.dim }}>
										Your financial data stays here
									</div>
								</div>
							</div>
							<Rise at={starter}>
								<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
									<Chip tint={color.pink}>Food</Chip>
									<Chip tint={color.pink}>Bills</Chip>
									<Chip tint={color.allocation}>Daily</Chip>
									<Chip tint={color.allocation}>Recurring</Chip>
								</div>
								<div style={{ fontSize: 22, color: color.dim, marginTop: 10 }}>
									Editable starter defaults
								</div>
							</Rise>
						</div>
					</BrowserWindow>
				</Rise>
			</At>
			<At
				x={600}
				y={10}
				w={352}
				style={{ display: "flex", flexDirection: "column", gap: 22 }}
			>
				<Rise at={learn} x={30} y={0}>
					<Card tint={color.record} glow={0.3} style={{ padding: 26 }}>
						<IconTile icon={BadgeCheck} tint={color.record} size={56} />
						<div style={{ fontSize: 28, fontWeight: 700, marginTop: 14 }}>
							Learn with samples
						</div>
						<div style={{ fontSize: 22, color: color.dim, marginTop: 4 }}>
							Practice in Help & guides
						</div>
					</Card>
				</Rise>
				<Rise at={restore} x={30} y={0}>
					<Card tint={color.allocation} style={{ padding: 26 }}>
						<IconTile icon={RotateCcw} tint={color.allocation} size={56} />
						<div style={{ fontSize: 28, fontWeight: 700, marginTop: 14 }}>
							Or restore
						</div>
						<div style={{ fontSize: 22, color: color.dim, marginTop: 4 }}>
							From a Finpoint backup
						</div>
					</Card>
				</Rise>
			</At>
		</>
	)
}

function WorkspaceExample() {
	const practice = useAt("practice", 0)
	const balance = useAt("balance", 60)
	const wall = useProgress(practice + 20, 30)
	return (
		<>
			<At x={0} y={20} w={430}>
				<Rise at={practice}>
					<Card tint={color.record} glow={0.4} style={{ padding: 28, height: 420 }}>
						<Kicker tint={color.record}>Practice lesson</Kicker>
						<div style={{ fontSize: 22, color: color.dim, margin: "6px 0 24px" }}>
							Sample values only
						</div>
						<StatementCard title="Sample lunch" amount={-12} compact />
						<div style={{ height: 14 }} />
						<RecordCard title="Lunch" amount={-12} icon={Utensils} compact />
					</Card>
				</Rise>
			</At>
			<At x={466} y={20} w={20} h={420}>
				<div
					style={{
						width: 4,
						height: `${wall * 100}%`,
						margin: "0 auto",
						borderRadius: 4,
						background: `linear-gradient(${color.ink}, ${alpha(color.ink, 0.1)})`,
					}}
				/>
			</At>
			<At x={522} y={20} w={430}>
				<Rise at={balance}>
					<Card style={{ padding: 28, height: 420 }}>
						<Kicker>Your workspace</Kicker>
						<div style={{ fontSize: 22, color: color.dim, margin: "6px 0 30px" }}>
							Untouched
						</div>
						<div style={{ fontSize: 24, color: color.dim }}>DBS Account balance</div>
						<div style={{ ...big, ...font.numbers, fontSize: 64 }}>$2,480</div>
						<div style={{ marginTop: 26 }}>
							<Chip tint={color.record}>No upload, no change</Chip>
						</div>
					</Card>
				</Rise>
			</At>
		</>
	)
}

// ─── 04 · Import bank activity ──────────────────────────────────────────────────────────

const banks = ["DBS", "OCBC", "UOB", "Revolut"]

function ImportProblem() {
	const file = useAt("bank", 0)
	const format = useAt("format", 40)
	const statements = useAt("Statements", 80)
	return (
		<>
			<At x={20} y={10}>
				<Rise at={file}>
					<FileDoc ext="CSV" name="dbs-october.csv" tint={color.record} size={1.2} />
				</Rise>
			</At>
			<At x={210} y={60}>
				<Rise at={format}>
					<FileDoc
						ext="PDF"
						name="statement.pdf"
						tint={color.danger}
						size={0.9}
						crossed={useProgress(format + 14, 16)}
					/>
				</Rise>
			</At>
			<Flow
				from={{ x: 200, y: 110 }}
				to={{ x: 520, y: 330 }}
				at={statements}
				tint={color.statement}
			/>
			<At
				x={530}
				y={40}
				w={422}
				style={{ display: "flex", flexDirection: "column", gap: 14 }}
			>
				<Rise at={format}>
					<Kicker tint={color.statement}>Supported formats</Kicker>
				</Rise>
				<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
					{banks.map((bank, index) => (
						<Pop key={bank} at={format + 6 + index * 5}>
							<Chip tint={color.statement} size={26}>
								{bank}
							</Chip>
						</Pop>
					))}
				</div>
				<div style={{ height: 18 }} />
				{[-12, 3000].map((amount, index) => (
					<Rise key={amount} at={statements + 10 + index * 8}>
						<StatementCard
							title={amount > 0 ? "SALARY" : "KOPI & CO"}
							amount={amount}
							compact
						/>
					</Rise>
				))}
			</At>
		</>
	)
}

function ImportHelps() {
	const importer = useAt("Importer", 0)
	const statements = useAt("Statements", 60)
	const accounts = useAt("Accounts", 110)
	const revolut = useAt("Revolut", 150, { nth: 1 })
	const counts: [string, number, string][] = [
		["Inserted", 24, color.record],
		["Re-indexed", 3, color.allocation],
		["Unchanged", 11, color.neutral],
	]
	return (
		<>
			<At x={0} y={10} w={420}>
				<Rise at={importer}>
					<Card tint={color.statement} glow={0.3} style={{ padding: 28, height: 470 }}>
						<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
							<IconTile icon={Upload} tint={color.statement} />
							<div style={{ fontSize: 32, fontWeight: 700 }}>Importer</div>
						</div>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 12,
								marginTop: 26,
							}}
						>
							{banks.map((bank, index) => (
								<Rise key={bank} at={importer + 6 + index * 4} y={10}>
									<div
										style={{
											padding: "16px 18px",
											borderRadius: 16,
											fontSize: 25,
											fontWeight: 650,
											background:
												index === 0
													? alpha(color.statement, 0.2)
													: "rgba(255,255,255,0.04)",
											boxShadow: `inset 0 0 0 1.5px ${index === 0 ? color.statement : color.line}`,
										}}
									>
										{bank}
									</div>
								</Rise>
							))}
						</div>
						<Rise at={accounts} style={{ marginTop: 22 }}>
							<Chip tint={color.record}>Missing Accounts created on import</Chip>
						</Rise>
						<Rise at={revolut} style={{ marginTop: 12 }}>
							<Chip tint={color.pending}>Revolut: one file + Account details</Chip>
						</Rise>
					</Card>
				</Rise>
			</At>
			<Flow
				from={{ x: 420, y: 160 }}
				to={{ x: 500, y: 160 }}
				at={statements}
				tint={color.statement}
			/>
			<At
				x={500}
				y={10}
				w={452}
				style={{ display: "flex", flexDirection: "column", gap: 14 }}
			>
				<Rise at={statements}>
					<Kicker tint={color.statement}>Statements, not finished Records</Kicker>
				</Rise>
				{counts.map(([label, value, tint], index) => (
					<Rise key={label} at={statements + 10 + index * 8} x={30} y={0}>
						<Card
							tint={tint}
							style={{
								padding: "18px 24px",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<span style={{ fontSize: 27, fontWeight: 600 }}>{label}</span>
							<CountUp
								value={value}
								at={statements + 14 + index * 8}
								signed={false}
								format={value => String(Math.round(value))}
								style={{ fontSize: 40, fontWeight: 750, color: tint }}
							/>
						</Card>
					</Rise>
				))}
			</At>
		</>
	)
}

function ImportExample() {
	const salary = useAt("salary", 20)
	const lunch = useAt("lunch", 60)
	const neither = useAt("Neither", 100)
	return (
		<At x={70} y={30} w={812} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
			<Rise at={useContext(BeatStart)}>
				<Chip tint={color.statement} size={24}>
					<FileSpreadsheet size={22} /> dbs-october.csv → 2 Statements
				</Chip>
			</Rise>
			{(
				[
					["SALARY · ACME PTE LTD", 3000, salary],
					["KOPI & CO", -12, lunch],
				] as const
			).map(([title, amount, at]) => (
				<Rise key={title} at={at} x={-40} y={0}>
					<StatementCard
						title={title}
						amount={amount}
						meta="DBS · Statement"
						footer={
							<div style={{ padding: "0 26px 22px" }}>
								<Pop at={neither}>
									<Chip tint={color.pending}>No Record explains this yet</Chip>
								</Pop>
							</div>
						}
					/>
				</Rise>
			))}
		</At>
	)
}

// ─── 05 · Explain your first purchase ───────────────────────────────────────────────────

function LunchProblem() {
	const statement = useAt("Statement", 0)
	const dashboard = useAt("Dashboard", 40)
	const record = useAt("Record", 70)
	return (
		<>
			<Flow
				from={{ x: 420, y: 180 }}
				to={{ x: 560, y: 180 }}
				at={dashboard}
				tint={color.danger}
				dashed
				pulses={false}
			/>
			<At x={0} y={100} w={420}>
				<Rise at={statement}>
					<StatementCard title="KOPI & CO" amount={-12} meta="DBS · 3 Oct" glow={0.3} />
				</Rise>
			</At>
			<At x={560} y={60} w={392}>
				<Rise at={dashboard}>
					<Tile
						label="Dashboard · Spending"
						value={<span style={font.numbers}>$0</span>}
						tint={color.spending}
						sub="Counts Records, not bank rows"
					/>
				</Rise>
			</At>
			<At x={360} y={360} w={240} style={{ display: "flex", justifyContent: "center" }}>
				<Pop at={record}>
					<Chip tint={color.record} size={26}>
						Needs a Record
					</Chip>
				</Pop>
			</At>
		</>
	)
}

function LunchHelps() {
	const allocator = useAt("Allocator", 0)
	const create = useAt("Create", 70)
	const title = useAt("title", 100)
	const press = useSpring(create + 10, { damping: 10 })
	return (
		<>
			<At x={0} y={0} w={500}>
				<Rise at={allocator}>
					<Card tint={color.allocation} style={{ padding: 26 }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: 14,
								marginBottom: 22,
							}}
						>
							<IconTile icon={Split} tint={color.allocation} size={52} />
							<div style={{ fontSize: 30, fontWeight: 700 }}>Allocator</div>
						</div>
						<div style={{ fontSize: 21, color: color.dim, marginBottom: 12 }}>
							Amounts still to explain
						</div>
						<StatementCard
							title="KOPI & CO"
							amount={-12}
							meta="Remaining −$12"
							compact
							glow={0.4}
						/>
						<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 10,
									padding: "16px 26px",
									borderRadius: 16,
									fontSize: 25,
									fontWeight: 700,
									color: color.night,
									background: color.ink,
									transform: `scale(${1 - 0.08 * Math.sin(Math.min(press, 1) * Math.PI)})`,
								}}
							>
								<MousePointerClick size={24} /> Create Record
							</div>
						</div>
					</Card>
				</Rise>
			</At>
			<Flow
				from={{ x: 500, y: 300 }}
				to={{ x: 560, y: 300 }}
				at={create + 14}
				tint={color.record}
			/>
			<At x={560} y={120} w={392}>
				<Rise at={create + 16} x={40} y={0}>
					<Card tint={color.record} glow={0.4} style={{ padding: 26 }}>
						<Kicker tint={color.record}>New Record</Kicker>
						{(
							[
								["Title", "Lunch"],
								["Amount", "Paid $12 → −$12"],
								["Category", "Food"],
							] as const
						).map(([label, value], index) => (
							<Rise key={label} at={title + index * 10} y={10}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										padding: "16px 0",
										borderBottom: `1.5px solid ${color.line}`,
										fontSize: 24,
									}}
								>
									<span style={{ color: color.dim }}>{label}</span>
									<b>{value}</b>
								</div>
							</Rise>
						))}
					</Card>
				</Rise>
			</At>
		</>
	)
}

function LunchExample() {
	const remaining = useAt("left", 120)
	return (
		<LunchFlow
			statementAt={useAt("bank", 0)}
			allocationAt={useAt("allocated", 30)}
			recordAt={useAt("Lunch", 60)}
			settled={remaining}
		/>
	)
}

// ─── 06 · Protect your first results ────────────────────────────────────────────────────

function BackupProblem() {
	const saved = useAt("saved", 0)
	const clear = useAt("clear", 60)
	const devices = useAt("devices", 100)
	const wipe = useProgress(clear + 8, 30)
	return (
		<>
			<At x={0} y={10} w={600}>
				<Rise at={saved}>
					<BrowserWindow url="finpoint.app" style={{ height: 470 }}>
						<div
							style={{
								padding: 28,
								display: "flex",
								flexDirection: "column",
								gap: 14,
								opacity: 1 - wipe,
								transform: `scale(${1 - wipe * 0.08})`,
								filter: `blur(${wipe * 10}px)`,
							}}
						>
							<RecordCard title="Lunch" amount={-12} icon={Utensils} compact />
							<RecordCard
								title="Groceries"
								amount={-60}
								icon={ShoppingBasket}
								compact
							/>
							<RecordCard title="Salary" amount={3000} icon={Wallet} compact />
						</div>
						<div
							style={{
								position: "absolute",
								inset: 0,
								display: "grid",
								placeItems: "center",
								opacity: wipe,
							}}
						>
							<Chip tint={color.danger} size={30}>
								Browser storage cleared
							</Chip>
						</div>
					</BrowserWindow>
				</Rise>
			</At>
			<At
				x={650}
				y={60}
				w={302}
				style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}
			>
				<Pop at={devices}>
					<IconTile icon={Laptop} tint={color.neutral} size={110} />
				</Pop>
				<Rise at={devices + 10}>
					<div style={{ fontSize: 26, color: color.dim, textAlign: "center" }}>
						A new device starts empty
					</div>
				</Rise>
			</At>
		</>
	)
}

function BackupHelps() {
	const browser = useAt("browser", 0)
	const backup = useAt("backup", 40)
	const request = useAt("Requesting", 120)
	return (
		<>
			<At x={0} y={40} w={420}>
				<Rise at={browser}>
					<BrowserWindow
						url="Sync · Backup file"
						tint={color.statement}
						style={{ height: 330 }}
					>
						<div
							style={{
								padding: 30,
								display: "flex",
								flexDirection: "column",
								gap: 20,
							}}
						>
							<div style={{ fontSize: 26, color: color.dim }}>
								Saved in this browser
							</div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 12,
									padding: "18px 24px",
									borderRadius: 16,
									background: color.ink,
									color: color.night,
									fontSize: 26,
									fontWeight: 700,
									width: "fit-content",
								}}
							>
								<Download size={26} /> Download backup
							</div>
						</div>
					</BrowserWindow>
				</Rise>
			</At>
			<Flow
				from={{ x: 420, y: 200 }}
				to={{ x: 580, y: 200 }}
				at={backup + 10}
				tint={color.record}
			/>
			<At x={580} y={20} w={372}>
				<Rise at={backup + 18}>
					<Card
						tint={color.record}
						glow={0.3}
						style={{
							padding: 28,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: 10,
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: 10,
								alignSelf: "flex-start",
								fontSize: 22,
								color: color.dim,
							}}
						>
							<FolderOpen size={24} /> Downloads
						</div>
						<FileDoc
							ext="JSON"
							name="finpoint-backup.json"
							tint={color.record}
							size={1.1}
						/>
					</Card>
				</Rise>
			</At>
			<At x={0} y={430} w={952} style={{ display: "flex", justifyContent: "center" }}>
				<Rise at={request}>
					<Chip tint={color.pending} size={26}>
						A click is not proof — find the file
					</Chip>
				</Rise>
			</At>
		</>
	)
}

function TimelineSteps({ steps }: { steps: [string, LucideIcon, string, number, string?][] }) {
	const width = 952 / steps.length
	return (
		<>
			{steps.slice(1).map(([, , tint, at], index) => (
				<Flow
					key={index}
					from={{ x: width * index + width / 2 + 70, y: 150 }}
					to={{ x: width * (index + 1) + width / 2 - 70, y: 150 }}
					at={at - 10}
					tint={tint}
				/>
			))}
			{steps.map(([title, icon, tint, at, note], index) => (
				<At
					key={title}
					x={width * index}
					y={60}
					w={width}
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						textAlign: "center",
						gap: 18,
					}}
				>
					<Pop at={at}>
						<IconTile icon={icon} tint={tint} size={120} />
					</Pop>
					<Rise at={at + 6}>
						<div style={{ fontSize: 30, fontWeight: 700, padding: "0 10px" }}>
							{title}
						</div>
						{note && (
							<div
								style={{
									fontSize: 22,
									color: tint,
									marginTop: 10,
									padding: "0 16px",
								}}
							>
								{note}
							</div>
						)}
					</Rise>
				</At>
			))}
		</>
	)
}

function BackupExample() {
	return (
		<TimelineSteps
			steps={[
				["Explain Lunch", Utensils, color.record, useAt("explaining", 0)],
				["Export a backup", Download, color.statement, useAt("exports", 40)],
				[
					"Restore later",
					RotateCcw,
					color.pending,
					useAt("restoring", 90),
					"Replaces this browser’s workspace",
				],
			]}
		/>
	)
}

// ─── 07 · Split one payment ─────────────────────────────────────────────────────────────

function SplitFlow({
	statementAt,
	firstAt,
	secondAt,
}: {
	statementAt: number
	firstAt: number
	secondAt: number
}) {
	const remaining = interpolate(
		useProgress(firstAt + 12, 24) + useProgress(secondAt + 12, 24),
		[0, 1, 2],
		[-80, -20, 0],
	)
	return (
		<>
			<Flow from={{ x: 380, y: 150 }} to={{ x: 220, y: 330 }} at={firstAt} vertical />
			<Flow from={{ x: 572, y: 150 }} to={{ x: 732, y: 330 }} at={secondAt} vertical />
			<At x={226} y={0} w={500}>
				<Rise at={statementAt}>
					<StatementCard
						title="NTUC FAIRPRICE"
						amount={-80}
						meta="DBS · 2 Oct"
						glow={0.3}
						footer={
							<div
								style={{
									padding: "0 26px 20px",
									display: "flex",
									alignItems: "center",
									gap: 16,
									fontSize: 21,
									color: color.dim,
								}}
							>
								Left to allocate
								<Meter
									value={remaining / -80}
									tint={color.statement}
									height={10}
									style={{ flex: 1 }}
								/>
								<b
									style={{
										...font.numbers,
										fontSize: 26,
										color: remaining === 0 ? color.record : color.ink,
									}}
								>
									{money(remaining)}
								</b>
							</div>
						}
					/>
				</Rise>
			</At>
			<At x={276} y={238} w={0}>
				<AllocationTag amount="−$60" at={firstAt + 10} />
			</At>
			<At x={676} y={238} w={0}>
				<AllocationTag amount="−$20" at={secondAt + 10} />
			</At>
			<At x={0} y={330} w={440}>
				<Rise at={firstAt + 14}>
					<RecordCard
						title="Groceries"
						amount={-60}
						icon={ShoppingBasket}
						chips={<Chip tint={color.pink}>Food</Chip>}
					/>
				</Rise>
			</At>
			<At x={512} y={330} w={440}>
				<Rise at={secondAt + 14}>
					<RecordCard
						title="Gift"
						amount={-20}
						icon={Gift}
						chips={<Chip tint={color.pink}>Shopping</Chip>}
					/>
				</Rise>
			</At>
		</>
	)
}

function SplitProblem() {
	const statement = useAt("Statement", 0)
	const items = useAt("groceries", 30)
	const one = useAt("one", 80, { nth: 1 })
	const hide = useProgress(useAt("hides", 120), 20)
	return (
		<>
			<At x={0} y={10} w={420}>
				<Rise at={statement}>
					<Card
						style={{
							padding: 30,
							background: "#f4f1ea",
							color: "#1c1b18",
							boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
							transform: "rotate(-2deg)",
						}}
					>
						<div
							style={{
								fontSize: 26,
								fontWeight: 800,
								letterSpacing: "0.1em",
								textAlign: "center",
							}}
						>
							NTUC FAIRPRICE
						</div>
						<div style={{ borderTop: "2px dashed #b7b2a5", margin: "18px 0" }} />
						{(
							[
								["Groceries", "$60.00", items],
								["Birthday mug", "$20.00", items + 20],
							] as const
						).map(([name, price, at]) => (
							<Rise key={name} at={at} y={8}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										fontSize: 25,
										padding: "8px 0",
										fontFamily: "ui-monospace, monospace",
									}}
								>
									<span>{name}</span>
									<span>{price}</span>
								</div>
							</Rise>
						))}
						<div style={{ borderTop: "2px dashed #b7b2a5", margin: "18px 0" }} />
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								fontSize: 28,
								fontWeight: 800,
								fontFamily: "ui-monospace, monospace",
							}}
						>
							<span>TOTAL</span>
							<span>$80.00</span>
						</div>
					</Card>
				</Rise>
			</At>
			<Flow from={{ x: 430, y: 220 }} to={{ x: 540, y: 220 }} at={one} tint={color.danger} />
			<At x={540} y={110} w={412}>
				<Rise at={one}>
					<RecordCard
						title="Groceries"
						amount={-80}
						icon={ShoppingBasket}
						chips={<Chip tint={color.pink}>Food</Chip>}
					/>
				</Rise>
				<Rise at={one + 30} style={{ marginTop: 22 }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 14,
							fontSize: 25,
							color: color.danger,
							opacity: 0.4 + 0.6 * hide,
						}}
					>
						<Gift size={30} />
						<span style={{ textDecoration: hide > 0.5 ? "line-through" : undefined }}>
							The $20 gift disappears into Food
						</span>
					</div>
				</Rise>
			</At>
		</>
	)
}

const SplitHelps = () => (
	<SplitFlow
		statementAt={useAt("Create", 0)}
		firstAt={useAt("allocate", 40)}
		secondAt={useAt("explanations", 80)}
	/>
)
const SplitExample = () => (
	<SplitFlow
		statementAt={useAt("Statement", 0)}
		firstAt={useAt("Groceries", 30)}
		secondAt={useAt("Gift", 60)}
	/>
)

// ─── 08 · Shared dinner and repayment ───────────────────────────────────────────────────

function RepaymentFlow({
	payAt,
	backAt,
	recordAt,
	totalAt,
}: {
	payAt: number
	backAt: number
	recordAt: number
	totalAt: number
}) {
	return (
		<>
			<Flow from={{ x: 320, y: 60 }} to={{ x: 552, y: 170 }} at={recordAt} />
			<Flow
				from={{ x: 320, y: 300 }}
				to={{ x: 552, y: 220 }}
				at={backAt + 10}
				tint={color.income}
			/>
			<At x={0} y={10} w={320}>
				<Rise at={payAt}>
					<StatementCard title="DINNER" amount={-90} meta="4 Oct" compact />
				</Rise>
			</At>
			<At x={0} y={250} w={320}>
				<Rise at={backAt}>
					<StatementCard
						title="PAYNOW"
						amount={60}
						meta="6 Oct"
						compact
						tint={color.income}
					/>
				</Rise>
			</At>
			<At x={436} y={100} w={0}>
				<AllocationTag amount="−$90" label="" at={recordAt + 10} />
			</At>
			<At x={436} y={268} w={0}>
				<AllocationTag amount="+$60" label="" at={backAt + 20} />
			</At>
			<At x={552} y={110} w={400}>
				<Rise at={recordAt}>
					<RecordCard
						title="Shared dinner"
						icon={Users}
						glow={0.4}
						compact
						right={
							<Roll
								at={backAt + 24}
								before={<span style={{ ...big, fontSize: 34 }}>−$90</span>}
								after={
									<span style={{ ...big, fontSize: 34, color: color.record }}>
										−$30
									</span>
								}
							/>
						}
						chips={<Chip tint={color.pink}>Dining</Chip>}
					/>
				</Rise>
			</At>
			<At x={0} y={410} w={952} style={{ textAlign: "center" }}>
				<Rise at={totalAt}>
					<div style={{ ...font.numbers, fontSize: 40, fontWeight: 750 }}>
						−$90 <span style={{ color: color.income }}>+ $60</span> ={" "}
						<span style={{ color: color.record }}>−$30</span>
						<span
							style={{
								fontSize: 24,
								fontWeight: 500,
								color: color.dim,
								marginLeft: 18,
							}}
						>
							Alex’s own share
						</span>
					</div>
				</Rise>
			</At>
		</>
	)
}

function RepaymentProblem() {
	const pay = useAt("pays", 0)
	const back = useAt("receives", 40)
	const own = useAt("own", 80)
	return (
		<>
			<At x={0} y={20} w={460} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
				<Rise at={pay} x={-30} y={0}>
					<StatementCard title="DINNER" amount={-90} meta="Alex pays the table" />
				</Rise>
				<Rise at={back} x={-30} y={0}>
					<StatementCard
						title="PAYNOW"
						amount={60}
						meta="Friends pay Alex back"
						tint={color.income}
					/>
				</Rise>
			</At>
			<At x={520} y={60} w={432}>
				<Rise at={own}>
					<Card
						tint={color.record}
						glow={0.4}
						style={{ padding: 34, textAlign: "center" }}
					>
						<Kicker tint={color.record}>Alex’s real cost</Kicker>
						<div
							style={{
								...font.numbers,
								fontSize: 110,
								fontWeight: 800,
								letterSpacing: "-0.05em",
								marginTop: 10,
							}}
						>
							<Roll
								at={own + 30}
								before={
									<span
										style={{
											color: color.danger,
											textDecoration: "line-through",
										}}
									>
										$90
									</span>
								}
								after={<span style={{ color: color.record }}>$30</span>}
							/>
						</div>
					</Card>
				</Rise>
			</At>
		</>
	)
}

const RepaymentHelps = () => (
	<RepaymentFlow
		payAt={useAt("payment", 0)}
		backAt={useAt("repayment", 20)}
		recordAt={useAt("Record", 40)}
		totalAt={useAt("reduces", 120)}
	/>
)
const RepaymentExample = () => (
	<RepaymentFlow
		payAt={useAt("Payment", 0)}
		backAt={useAt("Repayment", 30)}
		recordAt={useAt("Shared", 20)}
		totalAt={useAt("shows", 80)}
	/>
)

// ─── 09 · Refunds, transfers and savings ────────────────────────────────────────────────

const lanes: [string, LucideIcon, string][] = [
	["Income", TrendingUp, color.income],
	["Spending", ShoppingBasket, color.spending],
	["Saving / investment", PiggyBank, color.saving],
	["Transfer / neutral", ArrowDownUp, color.neutral],
]

function TreatmentsProblem() {
	const sign = useAt("sign", 0)
	const what = useAt("income", 40)
	const amounts = [3000, -12, 20, -300, 50, -200, 200]
	return (
		<>
			{amounts.map((amount, index) => {
				const angle = (index / amounts.length) * Math.PI * 2
				return (
					<At
						key={amount}
						x={476 + Math.cos(angle) * 330 - 90}
						y={240 + Math.sin(angle) * 190 - 30}
					>
						<Float seed={index}>
							<Pop at={sign + index * 5}>
								<Chip tint={amount > 0 ? color.income : color.spending} size={32}>
									<span style={font.numbers}>{money(amount)}</span>
								</Chip>
							</Pop>
						</Float>
					</At>
				)
			})}
			<At x={326} y={160} w={300} style={{ textAlign: "center" }}>
				<Pop at={what}>
					<div
						style={{
							fontSize: 130,
							fontWeight: 800,
							color: color.allocation,
							lineHeight: 1,
						}}
					>
						?
					</div>
					<div style={{ fontSize: 26, color: color.dim, marginTop: 8 }}>
						+ or − isn’t the whole story
					</div>
				</Pop>
			</At>
		</>
	)
}

function Float({ seed, children }: { seed: number; children: ReactNode }) {
	const frame = useCurrentFrame()
	const reduced = useReduced()
	const y = reduced ? 0 : Math.sin(frame / 22 + seed * 1.7) * 8
	return <div style={{ transform: `translateY(${y}px)` }}>{children}</div>
}

function TreatmentsHelps() {
	const at = [
		useAt("Income", 0),
		useAt("Spending", 20),
		useAt("Saving", 40),
		useAt("Transfer", 60),
	]
	const auto = useAt("Automatic", 120)
	const items: [number, string, number][] = [
		[0, "Salary +$3,000", 0],
		[1, "Lunch −$12", 1],
		[1, "Refund +$20", 1],
		[2, "Savings −$300", 2],
		[3, "Own transfer $0", 3],
	]
	return (
		<>
			{lanes.map(([title, icon, tint], index) => (
				<At key={title} x={index * 240} y={0} w={224}>
					<Rise at={at[index] ?? 0} y={40}>
						<Card tint={tint} glow={0.25} style={{ padding: 22, height: 420 }}>
							<IconTile icon={icon} tint={tint} size={58} />
							<div
								style={{
									fontSize: 26,
									fontWeight: 700,
									margin: "16px 0 20px",
									lineHeight: 1.15,
								}}
							>
								{title}
							</div>
							<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
								{items
									.filter(([lane]) => lane === index)
									.map(([, label], row) => (
										<Pop key={label} at={(at[index] ?? 0) + 14 + row * 10}>
											<div
												style={{
													padding: "12px 14px",
													borderRadius: 14,
													fontSize: 21,
													fontWeight: 650,
													background: alpha(tint, 0.16),
													boxShadow: `inset 0 0 0 1.5px ${alpha(tint, 0.4)}`,
													...font.numbers,
												}}
											>
												{label}
											</div>
										</Pop>
									))}
							</div>
						</Card>
					</Rise>
				</At>
			))}
			<At x={0} y={445} w={952} style={{ display: "flex", justifyContent: "center" }}>
				<Rise at={auto}>
					<Chip tint={color.allocation} size={24}>
						Automatic follows direction: + counts as income
					</Chip>
				</Rise>
			</At>
		</>
	)
}

function SavingTiles({ start }: { start: number }) {
	return (
		<>
			<At
				x={0}
				y={10}
				w={952}
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22 }}
			>
				<Rise at={start}>
					<Tile
						label="Contributions"
						tint={color.saving}
						value={<CountUp value={300} at={start} signed={false} />}
						sub="Cash moved to savings"
					/>
				</Rise>
				<Rise at={start + 30}>
					<Tile
						label="Withdrawals"
						tint={color.saving}
						value={<CountUp value={50} at={start + 30} signed={false} />}
						sub="Cash back from savings"
					/>
				</Rise>
				<Rise at={start + 60}>
					<Tile
						label="Net contributions"
						tint={color.allocation}
						value={<CountUp value={-250} at={start + 60} />}
						sub="$50 − $300"
					/>
				</Rise>
			</At>
		</>
	)
}

function TreatmentsExample() {
	const salary = useAt("Salary", 130)
	return (
		<>
			<SavingTiles start={useAt("contributions", 20)} />
			<At x={0} y={260} w={952} style={{ display: "flex", gap: 22, alignItems: "stretch" }}>
				<Rise at={salary} style={{ flex: 1 }}>
					<Tile
						label="Income · separate"
						tint={color.income}
						value={<CountUp value={3000} at={salary} />}
						sub="Salary never mixes with savings movements"
					/>
				</Rise>
			</At>
		</>
	)
}

function TreatmentsCheck() {
	const refund = useAt("refund", 0)
	const contributions = useAt("contributions", 90)
	return (
		<At
			x={0}
			y={0}
			w={952}
			style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}
		>
			<Rise at={refund}>
				<Tile
					label="Net spending"
					tint={color.spending}
					value={
						<Roll
							at={refund + 30}
							before={<span style={font.numbers}>$147</span>}
							after={
								<span style={{ ...font.numbers, color: color.record }}>$127</span>
							}
						/>
					}
					sub={<Chip tint={color.record}>+$20 Spending refund</Chip>}
				/>
			</Rise>
			<Rise at={contributions}>
				<Tile
					label="Contributions"
					tint={color.saving}
					value={<span style={font.numbers}>$300</span>}
					sub="Shown as a positive amount"
				/>
			</Rise>
		</At>
	)
}

// ─── 10 · Pending ──────────────────────────────────────────────────────────────────────

function PendingProblem() {
	const record = useAt("Record", 0)
	const reasons: [string, number][] = [
		["Amounts differ", useAt("amounts", 30)],
		["No Allocations yet", useAt("missing", 60)],
		["An allocated Statement is Pending", useAt("Pending", 90, { nth: 1 })],
	]
	return (
		<>
			<At x={0} y={20} w={430}>
				<Rise at={record}>
					<RecordCard
						title="Lunch"
						amount={-10}
						icon={Utensils}
						glow={0.3}
						status={<Status pending at={record + 10} />}
					/>
				</Rise>
			</At>
			<At x={480} y={0} w={472} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
				{reasons.map(([label, at], index) => (
					<Rise key={label} at={at} x={40} y={0}>
						<Card
							tint={color.pending}
							style={{
								padding: "22px 26px",
								display: "flex",
								alignItems: "center",
								gap: 18,
							}}
						>
							<div
								style={{
									width: 44,
									height: 44,
									borderRadius: 99,
									display: "grid",
									placeItems: "center",
									background: alpha(color.pending, 0.2),
									color: color.pending,
									fontWeight: 800,
									fontSize: 22,
								}}
							>
								{index + 1}
							</div>
							<span style={{ fontSize: 27, fontWeight: 600 }}>{label}</span>
						</Card>
					</Rise>
				))}
			</At>
		</>
	)
}

function PendingHelps() {
	const record = useAt("Record", 0)
	const statement = useAt("placeholder", 140)
	return (
		<>
			<At x={0} y={10} w={456}>
				<Rise at={record}>
					<Card tint={color.record} glow={0.25} style={{ padding: 30, height: 420 }}>
						<Kicker tint={color.record}>Pending Record</Kicker>
						<div
							style={{
								fontSize: 26,
								color: color.dim,
								margin: "10px 0 26px",
								lineHeight: 1.35,
							}}
						>
							The explanation doesn’t tally yet
						</div>
						<RecordCard
							title="Lunch"
							amount={-10}
							compact
							icon={Utensils}
							status={<Status pending at={record + 16} />}
						/>
					</Card>
				</Rise>
			</At>
			<At x={496} y={10} w={456}>
				<Rise at={statement}>
					<Card tint={color.pending} glow={0.25} style={{ padding: 30, height: 420 }}>
						<Kicker tint={color.pending}>Pending Statement</Kicker>
						<div
							style={{
								fontSize: 26,
								color: color.dim,
								margin: "10px 0 26px",
								lineHeight: 1.35,
							}}
						>
							A placeholder for expected bank activity
						</div>
						<div
							style={{
								border: `2.5px dashed ${alpha(color.pending, 0.6)}`,
								borderRadius: 26,
							}}
						>
							<StatementCard
								title="Rent"
								amount={-1800}
								pending
								compact
								style={{ background: "transparent", boxShadow: "none" }}
							/>
						</div>
					</Card>
				</Rise>
			</At>
		</>
	)
}

function PendingFix({ fixAt, start }: { fixAt: number; start: number }) {
	return (
		<>
			<At
				x={0}
				y={10}
				w={952}
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22 }}
			>
				<Rise at={start}>
					<Tile
						label="Record"
						tint={color.record}
						value={
							<Roll
								at={fixAt}
								before={<span style={font.numbers}>−$10</span>}
								after={<span style={font.numbers}>−$12</span>}
							/>
						}
					/>
				</Rise>
				<Rise at={start + 20}>
					<Tile
						label="Allocation"
						tint={color.allocation}
						value={<span style={font.numbers}>−$12</span>}
					/>
				</Rise>
				<Rise at={start + 40}>
					<Tile
						label="Difference"
						tint={color.pending}
						value={
							<Roll
								at={fixAt + 10}
								before={
									<span style={{ ...font.numbers, color: color.pending }}>
										$2
									</span>
								}
								after={
									<span style={{ ...font.numbers, color: color.record }}>$0</span>
								}
							/>
						}
					/>
				</Rise>
			</At>
			<At x={226} y={250} w={500}>
				<Rise at={start + 50}>
					<RecordCard
						title="Lunch"
						icon={Utensils}
						glow={0.3}
						right={
							<Roll
								at={fixAt}
								before={<span style={big}>−$10</span>}
								after={<span style={big}>−$12</span>}
							/>
						}
						status={
							<Roll
								at={fixAt + 24}
								before={<Status pending />}
								after={<Status pending={false} />}
							/>
						}
					/>
				</Rise>
			</At>
		</>
	)
}

const PendingExample = () => <PendingFix start={useAt("Record", 0)} fixAt={useAt("Change", 120)} />

function PendingCheck() {
	return (
		<At x={0} y={20} w={952} style={{ display: "flex", flexDirection: "column", gap: 34 }}>
			<ChecklistRow label="At least one Allocation exists" at={useAt("Allocation", 10)} />
			<ChecklistRow label="Its total matches the Record" at={useAt("matches", 40)} />
			<ChecklistRow label="No allocated Statement is Pending" at={useAt("Pending", 70)} />
		</At>
	)
}

// ─── 11 · Find, edit or remove ──────────────────────────────────────────────────────────

function FindProblem() {
	const filters = useAt("filters", 20)
	const month = useAt("month", 50)
	const empty = useAt("empty", 80)
	return (
		<Rise at={useContext(BeatStart)} y={30}>
			<BrowserWindow url="finpoint.app/records" style={{ height: 500 }}>
				<div style={{ padding: 28 }}>
					<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
						<Pop at={month}>
							<Chip tint={color.statement} size={24}>
								<CalendarRange size={20} /> September
							</Chip>
						</Pop>
						<Pop at={filters}>
							<Chip tint={color.pink} size={24}>
								Category: Travel
							</Chip>
						</Pop>
						<Pop at={filters + 10}>
							<Chip tint={color.allocation} size={24}>
								Account: OCBC
							</Chip>
						</Pop>
					</div>
					<div style={{ height: 340, display: "grid", placeItems: "center" }}>
						<Pop at={empty}>
							<div style={{ textAlign: "center", color: color.dim }}>
								<FileSearch size={84} strokeWidth={1.5} />
								<div
									style={{
										fontSize: 30,
										fontWeight: 650,
										color: color.ink,
										marginTop: 12,
									}}
								>
									No Records match
								</div>
								<div style={{ fontSize: 23, marginTop: 6 }}>
									Your data is still here — the view is narrow
								</div>
							</div>
						</Pop>
					</div>
				</div>
			</BrowserWindow>
		</Rise>
	)
}

function FindHelps() {
	const views: [string, string, LucideIcon, string, number][] = [
		["Records", "Your explanations", BadgeCheck, color.record, useAt("Records", 0)],
		[
			"Statements",
			"Every bank row, even fully allocated",
			Import,
			color.statement,
			useAt("Statements", 20),
		],
		[
			"Allocator",
			"Only amounts left to explain",
			Split,
			color.allocation,
			useAt("Allocator", 40),
		],
	]
	const search = useAt("search", 100)
	return (
		<>
			{views.map(([title, body, icon, tint, at], index) => (
				<At key={title} x={index * 324} y={0} w={304}>
					<Rise at={at} y={40}>
						<Card tint={tint} glow={0.25} style={{ padding: 26, height: 340 }}>
							<IconTile icon={icon} tint={tint} />
							<div
								style={{
									fontSize: 32,
									fontWeight: 750,
									marginTop: 18,
									color: tint,
								}}
							>
								{title}
							</div>
							<div
								style={{
									fontSize: 24,
									color: color.dim,
									marginTop: 8,
									lineHeight: 1.35,
								}}
							>
								{body}
							</div>
						</Card>
					</Rise>
				</At>
			))}
			<At x={0} y={380} w={952} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
				{["Search", "Account", "Category", "Dates", "Amount"].map((label, index) => (
					<Pop key={label} at={search + index * 6}>
						<Chip tint={color.ink} size={24}>
							{index === 0 ? <Search size={20} /> : <ListFilter size={20} />} {label}
						</Chip>
					</Pop>
				))}
			</At>
		</>
	)
}

function FindExample() {
	const paid = useAt("Paid", 20)
	const typed = useAt("50", 50)
	const frame = useCurrentFrame()
	const text = "50".slice(0, Math.max(0, Math.min(2, Math.floor((frame - typed) / 5) + 1)))
	const rows: [string, number][] = [
		["SAKURA DINING", -90],
		["NTUC FAIRPRICE", -80],
		["KOPI & CO", -12],
	]
	return (
		<>
			<At x={0} y={0} w={420}>
				<Rise at={useContext(BeatStart)}>
					<Card style={{ padding: 28 }}>
						<Kicker>Amount filter</Kicker>
						<div
							style={{
								display: "flex",
								marginTop: 18,
								padding: 6,
								borderRadius: 16,
								background: "rgba(255,255,255,0.06)",
							}}
						>
							{["Paid", "Received"].map((label, index) => (
								<div
									key={label}
									style={{
										flex: 1,
										textAlign: "center",
										padding: "14px 0",
										borderRadius: 12,
										fontSize: 25,
										fontWeight: 650,
										background:
											index === 0 && frame >= paid
												? color.ink
												: "transparent",
										color:
											index === 0 && frame >= paid ? color.night : color.dim,
									}}
								>
									{label}
								</div>
							))}
						</div>
						<div
							style={{
								marginTop: 18,
								padding: "16px 20px",
								borderRadius: 14,
								boxShadow: `inset 0 0 0 2px ${frame >= typed ? color.allocation : color.line}`,
								fontSize: 32,
								...font.numbers,
							}}
						>
							Over ${text}
							<span
								style={{
									opacity: frame % 30 < 15 ? 1 : 0,
									color: color.allocation,
								}}
							>
								|
							</span>
						</div>
						<Rise at={typed + 20} style={{ marginTop: 16 }}>
							<Chip tint={color.record}>No minus sign needed</Chip>
						</Rise>
					</Card>
				</Rise>
			</At>
			<At x={470} y={0} w={482} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
				{rows.map(([title, amount], index) => {
					const hidden = Math.abs(amount) <= 50
					return (
						<FilteredRow key={title} hidden={hidden} at={typed + 14} delay={index * 6}>
							<StatementCard title={title} amount={amount} compact />
						</FilteredRow>
					)
				})}
			</At>
		</>
	)
}

function FilteredRow({
	hidden,
	at,
	delay,
	children,
}: {
	hidden: boolean
	at: number
	delay: number
	children: ReactNode
}) {
	const progress = useProgress(at + delay, 18)
	return (
		<Rise at={useContext(BeatStart) + delay}>
			<div
				style={{
					opacity: hidden ? 1 - progress * 0.75 : 1,
					transform: hidden ? `scale(${1 - progress * 0.06})` : undefined,
					filter: hidden ? `grayscale(${progress})` : undefined,
				}}
			>
				{children}
			</div>
		</Rise>
	)
}

// ─── 12 · Category, treatment, bucket ───────────────────────────────────────────────────

const facets: [string, string, string, string][] = [
	["Category", "What it is for", "Food", color.pink],
	["Treatment", "How totals count it", "Spending", color.spending],
	["Bucket", "Optional planning group", "Daily", color.allocation],
]

function CategoriesProblem() {
	const frame = useCurrentFrame()
	const reduced = useReduced()
	const start = useAt("Three", 0)
	const mixing = useAt("Mixing", 60)
	const tangle = useProgress(mixing, 30)
	return (
		<>
			{facets.map(([name, , , tint], index) => {
				const angle = frame / 40 + (index * Math.PI * 2) / 3
				const radius = 170 * (1 - tangle * 0.35)
				return (
					<At
						key={name}
						x={476 + Math.cos(reduced ? index * 2 : angle) * radius - 110}
						y={230 + Math.sin(reduced ? index * 2 : angle) * radius * 0.7 - 34}
					>
						<Pop at={start + index * 10}>
							<Chip tint={tint} size={36}>
								{name}
							</Chip>
						</Pop>
					</At>
				)
			})}
			<At x={226} y={440} w={500} style={{ textAlign: "center" }}>
				<Rise at={mixing + 20}>
					<span style={{ fontSize: 28, color: color.pending }}>
						Mixed up, the totals stop making sense
					</span>
				</Rise>
			</At>
		</>
	)
}

function CategoriesHelps() {
	const at = [useAt("Category", 0), useAt("Treatment", 40), useAt("bucket", 80)]
	return (
		<>
			<At x={186} y={10} w={580}>
				<Rise at={useContext(BeatStart)}>
					<RecordCard
						title="Lunch"
						icon={Utensils}
						glow={0.3}
						chips={facets.map(([name, , value, tint], index) => (
							<Pop key={name} at={(at[index] ?? 0) + 20}>
								<Chip tint={tint}>{value}</Chip>
							</Pop>
						))}
					/>
				</Rise>
			</At>
			{facets.map(([name, body, value, tint], index) => (
				<At key={name} x={index * 324} y={210} w={304}>
					<Rise at={at[index] ?? 0} y={40}>
						<Card tint={tint} glow={0.25} style={{ padding: 26, height: 260 }}>
							<Kicker tint={tint}>{name}</Kicker>
							<div style={{ fontSize: 38, fontWeight: 750, margin: "12px 0" }}>
								{value}
							</div>
							<div style={{ fontSize: 24, color: color.dim, lineHeight: 1.35 }}>
								{body}
							</div>
						</Card>
					</Rise>
				</At>
			))}
		</>
	)
}

function CategoriesExample() {
	const lunch = useAt("Category", 0)
	const rent = useAt("rent", 80)
	const rows: [string, LucideIcon, number, string[], number][] = [
		["Lunch", Utensils, -12, ["Food", "Spending", "Daily"], lunch],
		["Rent", House, -1800, ["Housing", "Spending", "Recurring"], rent],
	]
	return (
		<At x={0} y={10} w={952} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "260px 1fr 1fr 1fr",
					gap: 14,
					padding: "0 26px",
				}}
			>
				<span />
				{facets.map(([name, , , tint]) => (
					<Kicker key={name} tint={tint}>
						{name}
					</Kicker>
				))}
			</div>
			{rows.map(([title, icon, amount, values, at]) => (
				<Rise key={title} at={at} x={-30} y={0}>
					<Card
						tint={color.record}
						style={{
							padding: "22px 26px",
							display: "grid",
							gridTemplateColumns: "260px 1fr 1fr 1fr",
							gap: 14,
							alignItems: "center",
						}}
					>
						<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
							<IconTile icon={icon} tint={color.record} size={52} />
							<div>
								<div style={{ fontSize: 28, fontWeight: 700 }}>{title}</div>
								<div style={{ fontSize: 22, color: color.dim, ...font.numbers }}>
									{money(amount)}
								</div>
							</div>
						</div>
						{values.map((value, index) => (
							<Pop key={value} at={at + 10 + index * 8}>
								<Chip tint={facets[index]?.[3] ?? color.dim} size={24}>
									{value}
								</Chip>
							</Pop>
						))}
					</Card>
				</Rise>
			))}
			<Rise at={rent + 40} style={{ alignSelf: "center", marginTop: 10 }}>
				<Chip tint={color.spending} size={24}>
					Same treatment, different bucket
				</Chip>
			</Rise>
		</At>
	)
}

// ─── 13 · Monthly bucket targets ────────────────────────────────────────────────────────

function MonthStrip({
	defaultAt,
	overrideAt,
	showOverride,
}: {
	defaultAt: number
	overrideAt: number
	showOverride: boolean
}) {
	const months = ["Sep", "Oct", "Nov", "Dec", "Jan"]
	const sweep = useProgress(defaultAt + 10, 50)
	const override = useSpring(overrideAt)
	return (
		<At x={0} y={40} w={952}>
			<div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
				{months.map((month, index) => {
					const covered = index >= 1 && sweep * 4 >= index - 1
					const isOverride = showOverride && index === 1
					return (
						<Card
							key={month}
							tint={covered ? color.pink : undefined}
							glow={covered ? 0.2 : 0}
							style={{ padding: "26px 0", textAlign: "center", height: 230 }}
						>
							<div style={{ fontSize: 26, color: color.dim, fontWeight: 600 }}>
								{month}
							</div>
							<div
								style={{
									...font.numbers,
									fontSize: 44,
									fontWeight: 750,
									marginTop: 26,
									opacity: covered ? 1 : 0.25,
								}}
							>
								{isOverride && override > 0.5 ? (
									<span style={{ color: color.pending }}>$600</span>
								) : covered ? (
									"$500"
								) : (
									"—"
								)}
							</div>
							{isOverride && (
								<div style={{ marginTop: 16, transform: `scale(${override})` }}>
									<Chip tint={color.pending} size={19}>
										Only Oct
									</Chip>
								</div>
							)}
						</Card>
					)
				})}
			</div>
			<div style={{ position: "relative", marginTop: 34, marginLeft: "20%", height: 14 }}>
				<Meter value={sweep} tint={color.pink} />
			</div>
			<div
				style={{
					marginLeft: "20%",
					marginTop: 14,
					fontSize: 24,
					color: color.pink,
					opacity: sweep,
				}}
			>
				Default $500 from October onward →
			</div>
		</At>
	)
}

function TargetsProblem() {
	const group = useAt("spending", 0)
	const moving = useAt("moving", 60)
	return (
		<>
			<At x={0} y={40} w={460}>
				<Rise at={group}>
					<Card tint={color.allocation} glow={0.3} style={{ padding: 32 }}>
						<Kicker tint={color.allocation}>Daily bucket · October</Kicker>
						<div
							style={{
								...font.numbers,
								fontSize: 84,
								fontWeight: 800,
								letterSpacing: "-0.04em",
								margin: "16px 0",
							}}
						>
							$127
						</div>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: 12,
								fontSize: 26,
								color: color.dim,
							}}
						>
							compared with <Mark at={group + 30}>?</Mark>
						</div>
					</Card>
				</Rise>
			</At>
			<At
				x={520}
				y={60}
				w={432}
				style={{ display: "flex", flexDirection: "column", gap: 18 }}
			>
				<Rise at={moving} x={30} y={0}>
					<Chip tint={color.record} size={26}>
						No money moves
					</Chip>
				</Rise>
				<Rise at={moving + 14} x={30} y={0}>
					<Chip tint={color.record} size={26}>
						Bank balances unchanged
					</Chip>
				</Rise>
			</At>
		</>
	)
}

const TargetsHelps = () => (
	<MonthStrip defaultAt={useAt("default", 0)} overrideAt={useAt("only", 100)} showOverride />
)
const TargetsExample = () => (
	<MonthStrip defaultAt={useAt("$500", 0)} overrideAt={useAt("$600", 60)} showOverride />
)

function TargetsCheck() {
	const start = useAt("Daily", 0)
	const fill = useProgress(start + 10, 50)
	return (
		<At x={70} y={20} w={812}>
			<Rise at={start}>
				<Card tint={color.allocation} glow={0.3} style={{ padding: 36 }}>
					<div style={{ display: "flex", alignItems: "center", gap: 18 }}>
						<IconTile icon={Target} tint={color.allocation} />
						<div style={{ fontSize: 34, fontWeight: 700 }}>Daily · October</div>
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "baseline",
							margin: "34px 0 18px",
						}}
					>
						<span
							style={{
								...font.numbers,
								fontSize: 76,
								fontWeight: 800,
								letterSpacing: "-0.04em",
							}}
						>
							<CountUp value={127} at={start + 10} duration={50} signed={false} />
						</span>
						<span style={{ fontSize: 30, color: color.dim, ...font.numbers }}>
							of $500 target
						</span>
					</div>
					<Meter value={fill * 0.254} tint={color.allocation} height={22} />
					<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
						<Rise at={useAt("$373", 70)}>
							<Chip tint={color.record} size={28}>
								$373 left in the plan
							</Chip>
						</Rise>
					</div>
				</Card>
			</Rise>
		</At>
	)
}

// ─── 14 · Budgets ──────────────────────────────────────────────────────────────────────

function DateRange({
	at,
	from = 3,
	to = 10,
	label,
}: {
	at: number
	from?: number
	to?: number
	label: string
}) {
	const days = 14
	const grow = useProgress(at, 30)
	return (
		<div>
			<div style={{ display: "grid", gridTemplateColumns: `repeat(${days}, 1fr)`, gap: 6 }}>
				{Array.from({ length: days }, (_, day) => (
					<div
						key={day}
						style={{
							height: 52,
							borderRadius: 10,
							display: "grid",
							placeItems: "center",
							fontSize: 18,
							color: color.dim,
							background:
								day >= from && day <= from + (to - from) * grow
									? alpha(color.pink, 0.35)
									: "rgba(255,255,255,0.05)",
							...font.numbers,
						}}
					>
						{((day + 27) % 31) + 1}
					</div>
				))}
			</div>
			<div style={{ fontSize: 22, color: color.pink, marginTop: 12, opacity: grow }}>
				{label}
			</div>
		</div>
	)
}

function BudgetsProblem() {
	const trip = useAt("trip", 0)
	const several = useAt("several", 60)
	return (
		<At x={0} y={30} w={952} style={{ display: "flex", flexDirection: "column", gap: 34 }}>
			<Rise at={trip}>
				<Card tint={color.pink} style={{ padding: 30 }}>
					<DateRange at={trip + 10} label="28 Oct → 4 Nov · crosses a month boundary" />
				</Card>
			</Rise>
			<div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
				{(
					[
						["Flights", Plane],
						["Hotel", House],
						["Food", Utensils],
						["Gifts", Gift],
					] as const
				).map(([label, Icon], index) => (
					<Pop key={label} at={several + index * 7}>
						<Chip tint={color.pink} size={28}>
							<Icon size={24} /> {label}
						</Chip>
					</Pop>
				))}
			</div>
		</At>
	)
}

function BudgetsHelps() {
	const amount = useAt("amount", 0)
	const dates = useAt("dates", 30)
	const attached = useAt("attached", 60)
	const spend = useProgress(attached + 30, 40)
	const records: [string, number][] = [
		["Flights", -420],
		["Hotel", -380],
		["Dinner", -64],
	]
	return (
		<>
			<At x={0} y={0} w={540}>
				<Rise at={amount}>
					<Card tint={color.pink} glow={0.35} style={{ padding: 30 }}>
						<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
							<IconTile icon={Plane} tint={color.pink} />
							<div>
								<div style={{ fontSize: 32, fontWeight: 750 }}>Bali trip</div>
								<div style={{ fontSize: 22, color: color.dim }}>Budget</div>
							</div>
							<div
								style={{
									marginLeft: "auto",
									...font.numbers,
									fontSize: 44,
									fontWeight: 800,
								}}
							>
								$1,200
							</div>
						</div>
						<div style={{ marginTop: 26 }}>
							<DateRange at={dates} label="28 Oct → 4 Nov" />
						</div>
						<div
							style={{
								marginTop: 26,
								display: "flex",
								justifyContent: "space-between",
								fontSize: 22,
								color: color.dim,
							}}
						>
							<span>Attached Records</span>
							<CountUp value={-864 * spend} at={0} duration={1} />
						</div>
						<Meter value={spend * 0.72} tint={color.pink} style={{ marginTop: 12 }} />
					</Card>
				</Rise>
			</At>
			<At x={590} y={0} w={362} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
				{records.map(([title, value], index) => (
					<Rise key={title} at={attached + index * 10} x={40} y={0}>
						<RecordCard
							title={title}
							amount={value}
							compact
							icon={index === 0 ? Plane : index === 1 ? House : Utensils}
							chips={
								<Chip tint={color.pink} size={18}>
									Attached
								</Chip>
							}
						/>
					</Rise>
				))}
			</At>
		</>
	)
}

function BudgetsExample() {
	const budget = useAt("Budget", 0)
	const bucket = useAt("Travel", 60)
	return (
		<>
			<At x={0} y={20} w={456}>
				<Rise at={budget}>
					<Card tint={color.pink} glow={0.3} style={{ padding: 30, height: 400 }}>
						<IconTile icon={CalendarRange} tint={color.pink} size={70} />
						<div style={{ fontSize: 36, fontWeight: 750, marginTop: 20 }}>Budget</div>
						<div
							style={{
								fontSize: 25,
								color: color.dim,
								marginTop: 10,
								lineHeight: 1.4,
							}}
						>
							A week-long holiday. Custom dates, hand-picked Records.
						</div>
						<div style={{ marginTop: 22 }}>
							<Chip tint={color.pink}>28 Oct → 4 Nov</Chip>
						</div>
					</Card>
				</Rise>
			</At>
			<At x={496} y={20} w={456}>
				<Rise at={bucket}>
					<Card tint={color.allocation} glow={0.3} style={{ padding: 30, height: 400 }}>
						<IconTile icon={Repeat} tint={color.allocation} size={70} />
						<div style={{ fontSize: 36, fontWeight: 750, marginTop: 20 }}>
							Travel bucket
						</div>
						<div
							style={{
								fontSize: 25,
								color: color.dim,
								marginTop: 10,
								lineHeight: 1.4,
							}}
						>
							The broader monthly planning view, month after month.
						</div>
						<div style={{ marginTop: 22 }}>
							<Chip tint={color.allocation}>Every month</Chip>
						</div>
					</Card>
				</Rise>
			</At>
		</>
	)
}

// ─── 15 · Dashboard ────────────────────────────────────────────────────────────────────

function DashboardProblem() {
	const charts = useAt("charts", 0)
	const balance = useAt("balances", 80)
	return (
		<>
			<At x={0} y={30} w={420}>
				<Rise at={balance}>
					<Tile
						label="DBS Account balance"
						tint={color.statement}
						value={<span style={font.numbers}>$12,480</span>}
						sub="What sits in the bank"
					/>
				</Rise>
			</At>
			<At x={430} y={60} w={92} style={{ textAlign: "center" }}>
				<Pop at={balance + 20}>
					<span style={{ fontSize: 80, fontWeight: 300, color: color.pending }}>≠</span>
				</Pop>
			</At>
			<At x={532} y={30} w={420}>
				<Rise at={charts}>
					<Tile
						label="Net spending · October"
						tint={color.spending}
						value={<span style={font.numbers}>$127</span>}
						sub="What your Records explain"
					/>
				</Rise>
			</At>
			<At
				x={0}
				y={260}
				w={952}
				style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
			>
				{["Month", "Coverage", "Record dates", "Treatments"].map((label, index) => (
					<Pop key={label} at={charts + 20 + index * 8}>
						<Chip tint={color.allocation} size={26}>
							{label}
						</Chip>
					</Pop>
				))}
			</At>
		</>
	)
}

function DashboardHelps() {
	const summary = useAt("summarizes", 0)
	const category = useAt("Category", 40)
	const monthly = useAt("Monthly", 120)
	const categories: [string, number, string][] = [
		["Food", 0.62, color.pink],
		["Shopping", 0.28, color.spending],
		["Transport", 0.1, color.statement],
	]
	return (
		<>
			<At
				x={0}
				y={0}
				w={952}
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}
			>
				{(
					[
						["Income", 3000, color.income],
						["Net spending", 127, color.spending],
						["Surplus", 2873, color.record],
					] as const
				).map(([label, value, tint], index) => (
					<Rise key={label} at={summary + index * 10}>
						<Tile
							label={label}
							tint={tint}
							value={
								<CountUp value={value} at={summary + index * 10} signed={false} />
							}
						/>
					</Rise>
				))}
			</At>
			<At x={0} y={190} w={560}>
				<Rise at={category}>
					<Card style={{ padding: 28 }}>
						<Kicker>Spending by Category</Kicker>
						{categories.map(([label, share, tint], index) => (
							<div key={label} style={{ marginTop: 20 }}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										fontSize: 23,
										marginBottom: 8,
									}}
								>
									<span>{label}</span>
									<span style={{ color: color.dim, ...font.numbers }}>
										{Math.round(share * 100)}%
									</span>
								</div>
								<Meter
									value={share * useProgress(category + 10 + index * 8, 30)}
									tint={tint}
								/>
							</div>
						))}
					</Card>
				</Rise>
			</At>
			<At x={600} y={190} w={352}>
				<Rise at={monthly}>
					<Card tint={color.record} style={{ padding: 28, height: 274 }}>
						<IconTile icon={FileSearch} tint={color.record} />
						<div style={{ fontSize: 28, fontWeight: 700, marginTop: 16 }}>
							Monthly Records
						</div>
						<div style={{ fontSize: 22, color: color.dim, marginTop: 6 }}>
							Trace any total to the Records behind it
						</div>
					</Card>
				</Rise>
			</At>
		</>
	)
}

function DashboardCheck() {
	const income = useAt("income", 0)
	const gross = useAt("gross", 30)
	const refunds = useAt("refunds", 60)
	const net = useAt("net", 90)
	const surplus = useAt("Surplus", 130)
	const op = (symbol: string, at: number) => (
		<Pop at={at}>
			<span style={{ fontSize: 50, color: color.dim, fontWeight: 300 }}>{symbol}</span>
		</Pop>
	)
	return (
		<At x={0} y={10} w={952} style={{ display: "flex", flexDirection: "column", gap: 26 }}>
			<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
				<Rise at={gross} style={{ flex: 1 }}>
					<Tile
						label="Gross spending"
						tint={color.spending}
						value={<CountUp value={147} at={gross} signed={false} />}
					/>
				</Rise>
				{op("−", refunds)}
				<Rise at={refunds} style={{ flex: 1 }}>
					<Tile
						label="Refunds"
						tint={color.record}
						value={<CountUp value={20} at={refunds} signed={false} />}
					/>
				</Rise>
				{op("=", net)}
				<Rise at={net} style={{ flex: 1 }}>
					<Tile
						label="Net spending"
						tint={color.spending}
						value={<CountUp value={127} at={net} signed={false} />}
					/>
				</Rise>
			</div>
			<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
				<Rise at={income} style={{ flex: 1 }}>
					<Tile
						label="Income"
						tint={color.income}
						value={<CountUp value={3000} at={income} signed={false} />}
					/>
				</Rise>
				{op("→", surplus)}
				<Rise at={surplus} style={{ flex: 1.3 }}>
					<Tile
						label="Surplus"
						tint={color.record}
						value={<CountUp value={2873} at={surplus} signed={false} />}
						sub="About 95.8% of income"
					/>
				</Rise>
			</div>
		</At>
	)
}

function DashboardExample() {
	const saving = useAt("Saving", 0)
	const not = useAt("fell", 60)
	return (
		<>
			<At
				x={0}
				y={20}
				w={952}
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr",
					gap: 18,
					opacity: 0.4,
				}}
			>
				<Tile label="Income" tint={color.income} value="$3,000" />
				<Tile label="Net spending" tint={color.spending} value="$127" />
				<Tile label="Surplus" tint={color.record} value="$2,873" />
			</At>
			<At x={166} y={210} w={620}>
				<Rise at={saving} y={50}>
					<Tile
						label="Saving · net contributions"
						tint={color.saving}
						value={<CountUp value={-250} at={saving} />}
						sub="Shown on its own line"
					/>
				</Rise>
				<div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "center" }}>
					<Pop at={not}>
						<Chip tint={color.record}>Income didn’t fall</Chip>
					</Pop>
					<Pop at={not + 20}>
						<Chip tint={color.record}>Not an investment loss</Chip>
					</Pop>
				</div>
			</At>
		</>
	)
}

// ─── 16 · Backups and Drive sync ────────────────────────────────────────────────────────

function SyncProblem() {
	const copy = useAt("copy", 0)
	const device = useAt("device", 30)
	const current = useAt("current", 70)
	return (
		<>
			<At x={60} y={60}>
				<Rise at={copy}>
					<div style={{ textAlign: "center" }}>
						<IconTile icon={Laptop} tint={color.statement} size={170} />
						<div style={{ fontSize: 26, marginTop: 14, color: color.dim }}>
							Laptop · edited 9:12
						</div>
					</div>
				</Rise>
			</At>
			<At x={700} y={60}>
				<Rise at={device}>
					<div style={{ textAlign: "center" }}>
						<IconTile icon={Smartphone} tint={color.allocation} size={170} />
						<div style={{ fontSize: 26, marginTop: 14, color: color.dim }}>
							Phone · edited 9:40
						</div>
					</div>
				</Rise>
			</At>
			<Flow
				from={{ x: 250, y: 145 }}
				to={{ x: 690, y: 145 }}
				at={device + 10}
				tint={color.pending}
				dashed
				pulses={false}
			/>
			<At x={376} y={260} w={200} style={{ textAlign: "center" }}>
				<Mark at={current}>?</Mark>
				<Rise at={current + 6}>
					<div
						style={{
							fontSize: 26,
							marginTop: 12,
							color: color.pending,
							whiteSpace: "nowrap",
							marginLeft: -60,
							marginRight: -60,
						}}
					>
						Which copy is current?
					</div>
				</Rise>
			</At>
		</>
	)
}

function SyncStatus({ at }: { at: number }) {
	const frame = useCurrentFrame()
	const states: [string, string][] = [
		["Up to date", color.record],
		["Syncing…", color.statement],
		["Up to date", color.record],
	]
	const index = Math.max(0, Math.min(states.length - 1, Math.floor((frame - at) / 50)))
	const [label, tint] = states[index] ?? ["Up to date", color.record]
	return (
		<Chip tint={tint} size={26}>
			{label === "Syncing…" ? (
				<RefreshCw size={22} style={{ transform: `rotate(${frame * 6}deg)` }} />
			) : (
				<BadgeCheck size={22} />
			)}{" "}
			{label}
		</Chip>
	)
}

function SyncHelps() {
	const local = useAt("locally", 0)
	const backup = useAt("backup", 40)
	const drive = useAt("Drive", 70)
	const broker = useAt("broker", 140)
	return (
		<>
			<Flow
				from={{ x: 330, y: 120 }}
				to={{ x: 620, y: 120 }}
				at={drive + 10}
				tint={color.record}
			/>
			<Flow
				from={{ x: 620, y: 150 }}
				to={{ x: 330, y: 150 }}
				at={drive + 24}
				tint={color.record}
			/>
			<Flow
				from={{ x: 165, y: 230 }}
				to={{ x: 165, y: 330 }}
				at={backup + 6}
				tint={color.statement}
				vertical
			/>
			<At x={0} y={20} w={330}>
				<Rise at={local}>
					<Card
						tint={color.statement}
						glow={0.3}
						style={{ padding: 26, textAlign: "center" }}
					>
						<IconTile
							icon={HardDrive}
							tint={color.statement}
							size={80}
							style={{ margin: "0 auto" }}
						/>
						<div style={{ fontSize: 28, fontWeight: 700, marginTop: 14 }}>
							This browser
						</div>
					</Card>
				</Rise>
			</At>
			<At x={60} y={330}>
				<Rise at={backup + 16}>
					<FileDoc ext="JSON" name="Separate backup" tint={color.statement} size={0.85} />
				</Rise>
			</At>
			<At x={620} y={20} w={332}>
				<Rise at={drive}>
					<Card
						tint={color.record}
						glow={0.3}
						style={{ padding: 26, textAlign: "center" }}
					>
						<IconTile
							icon={CloudUpload}
							tint={color.record}
							size={80}
							style={{ margin: "0 auto" }}
						/>
						<div style={{ fontSize: 28, fontWeight: 700, marginTop: 14 }}>
							Your Google Drive
						</div>
					</Card>
				</Rise>
				<Rise
					at={drive + 30}
					style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
				>
					<SyncStatus at={drive + 30} />
				</Rise>
			</At>
			<At x={360} y={330} w={592}>
				<Rise at={broker}>
					<Card
						tint={color.neutral}
						style={{ padding: 24, display: "flex", alignItems: "center", gap: 18 }}
					>
						<IconTile icon={Lock} tint={color.neutral} size={56} />
						<div style={{ fontSize: 24, lineHeight: 1.35 }}>
							The sign-in broker never sees your financial tables
						</div>
					</Card>
				</Rise>
			</At>
		</>
	)
}

function SyncExample() {
	const lesson = useAt("practice", 0)
	const without = useAt("without", 60)
	const cross = useProgress(without + 10, 20)
	return (
		<>
			<At x={0} y={60} w={400}>
				<Rise at={lesson}>
					<Card tint={color.record} glow={0.4} style={{ padding: 30 }}>
						<IconTile icon={BadgeCheck} tint={color.record} size={70} />
						<div style={{ fontSize: 32, fontWeight: 750, marginTop: 18 }}>
							Practice lesson
						</div>
						<div style={{ fontSize: 24, color: color.dim, marginTop: 8 }}>
							Completed · remembered on this browser
						</div>
					</Card>
				</Rise>
			</At>
			{(
				[
					["Financial backup", Download, 40],
					["Google Drive", CloudUpload, 260],
				] as const
			).map(([label, icon, y]) => (
				<At key={label} x={560} y={y} w={392}>
					<Rise at={without + (y > 100 ? 10 : 0)} x={40} y={0}>
						<Card
							style={{
								padding: 24,
								display: "flex",
								alignItems: "center",
								gap: 18,
								opacity: 1 - cross * 0.3,
							}}
						>
							<IconTile icon={icon} tint={color.neutral} size={56} />
							<span style={{ fontSize: 27, fontWeight: 650 }}>{label}</span>
							<span
								style={{
									marginLeft: "auto",
									fontSize: 40,
									color: color.danger,
									opacity: cross,
									fontWeight: 800,
								}}
							>
								✕
							</span>
						</Card>
					</Rise>
				</At>
			))}
			<Flow
				from={{ x: 400, y: 160 }}
				to={{ x: 560, y: 90 }}
				at={without}
				tint={color.danger}
				dashed
				pulses={false}
			/>
			<Flow
				from={{ x: 400, y: 200 }}
				to={{ x: 560, y: 310 }}
				at={without + 10}
				tint={color.danger}
				dashed
				pulses={false}
			/>
		</>
	)
}

// ─── 17 · Routine ──────────────────────────────────────────────────────────────────────

const routine: [string, LucideIcon, string][] = [
	["Import", Import, color.statement],
	["Explain", Split, color.allocation],
	["Fix Pending", CircleDollarSign, color.pending],
	["Review month", ChartColumn, color.pink],
	["Back up", Download, color.record],
]

function Loop({ at, words }: { at: number[]; words?: boolean }) {
	const frame = useCurrentFrame()
	const reduced = useReduced()
	const spin = useProgress(at[0] ?? 0, 40)
	const lit = at.reduce((count, value) => (frame >= value ? count + 1 : count), 0) - 1
	const center = { x: 476, y: 250 }
	return (
		<>
			<svg
				width={952}
				height={520}
				style={{ position: "absolute", inset: 0, overflow: "visible" }}
				aria-hidden
			>
				<circle
					cx={center.x}
					cy={center.y}
					r={200}
					stroke={color.line}
					strokeWidth={4}
					fill="none"
				/>
				<circle
					cx={center.x}
					cy={center.y}
					r={200}
					stroke={color.record}
					strokeWidth={5}
					fill="none"
					pathLength={1}
					strokeDasharray="1 1"
					strokeDashoffset={1 - (spin * Math.max(0, lit + 1)) / routine.length}
					transform={`rotate(-90 ${center.x} ${center.y})`}
					strokeLinecap="round"
				/>
				{!reduced && spin >= 1 && (
					<circle
						cx={center.x + Math.cos(frame / 30 - Math.PI / 2) * 200}
						cy={center.y + Math.sin(frame / 30 - Math.PI / 2) * 200}
						r={9}
						fill={color.ink}
						style={{ filter: `drop-shadow(0 0 10px ${color.record})` }}
					/>
				)}
			</svg>
			{routine.map(([label, icon, tint], index) => {
				const angle = (index / routine.length) * Math.PI * 2 - Math.PI / 2
				return (
					<At
						key={label}
						x={center.x + Math.cos(angle) * 200 - 80}
						y={center.y + Math.sin(angle) * 200 - 46}
						w={160}
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: 8,
						}}
					>
						<Pop at={at[index] ?? 0}>
							<IconTile
								icon={icon}
								tint={tint}
								size={index === lit ? 92 : 80}
								style={{
									boxShadow:
										index === lit
											? `0 0 40px ${alpha(tint, 0.7)}, inset 0 0 0 2px ${tint}`
											: undefined,
								}}
							/>
						</Pop>
						{words !== false && (
							<Rise at={(at[index] ?? 0) + 4}>
								<div
									style={{
										fontSize: 22,
										fontWeight: 700,
										whiteSpace: "nowrap",
										padding: "4px 12px",
										borderRadius: 99,
										background: alpha(color.night, 0.8),
									}}
								>
									{label}
								</div>
							</Rise>
						)}
					</At>
				)
			})}
			<At x={center.x - 110} y={center.y - 40} w={220} style={{ textAlign: "center" }}>
				<Rise at={(at[0] ?? 0) + 10}>
					<RotateCcw size={46} color={color.record} />
					<div style={{ fontSize: 22, color: color.dim, marginTop: 4 }}>Each visit</div>
				</Rise>
			</At>
		</>
	)
}

function RoutineProblem() {
	const routineAt = useAt("routine", 0)
	const perfect = useAt("perfect", 40)
	const pile = useProgress(perfect + 20, 30)
	return (
		<>
			<At x={0} y={20} w={420}>
				<Rise at={perfect}>
					<div style={{ position: "relative", height: 420 }}>
						{Array.from({ length: 6 }, (_, index) => (
							<Card
								key={index}
								style={{
									position: "absolute",
									left: (index % 2) * 18,
									top: index * 68,
									width: 360,
									padding: "18px 22px",
									fontSize: 23,
									color: color.dim,
									transform: `rotate(${(index % 2 ? 1 : -1) * (2 + pile * 4)}deg)`,
								}}
							>
								☐{" "}
								{
									[
										"Every Category",
										"Every target",
										"Every Budget",
										"Every old month",
										"Every bucket",
										"Every setting",
									][index]
								}
							</Card>
						))}
					</div>
				</Rise>
			</At>
			<At x={480} y={70} w={472}>
				<Rise at={routineAt}>
					<Card tint={color.record} glow={0.4} style={{ padding: 32 }}>
						<Kicker tint={color.record}>A short routine</Kicker>
						<div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
							{routine.map(([label, , tint], index) => (
								<Pop key={label} at={routineAt + 10 + index * 6}>
									<Chip tint={tint}>{label}</Chip>
								</Pop>
							))}
						</div>
					</Card>
				</Rise>
			</At>
		</>
	)
}

const RoutineHelps = () => (
	<Loop
		at={[
			useAt("Import", 0),
			useAt("explain", 30),
			useAt("inspect", 60),
			useAt("review", 90),
			useAt("protect", 120),
		]}
	/>
)
const RoutineExample = () => (
	<Loop
		at={[
			useAt("import", 0),
			useAt("explain", 30),
			useAt("fix", 60),
			useAt("review", 90),
			useAt("backup", 120),
		]}
	/>
)

export const scenes: Record<
	string,
	{ problem: Beat; helps: Beat; example: Beat; check?: Beat; steps: LucideIcon[] }
> = {
	start: {
		problem: StartProblem,
		helps: StartHelps,
		example: StartExample,
		steps: [BadgeCheck, Upload, Split, Download],
	},
	model: {
		problem: ModelProblem,
		helps: ModelHelps,
		example: ModelExample,
		check: ModelCheck,
		steps: [FileSearch, Tags, BadgeCheck, ArrowDownUp],
	},
	workspace: {
		problem: WorkspaceProblem,
		helps: WorkspaceHelps,
		example: WorkspaceExample,
		steps: [Import, RotateCcw, Download, CircleDollarSign],
	},
	import: {
		problem: ImportProblem,
		helps: ImportHelps,
		example: ImportExample,
		steps: [FileSpreadsheet, Upload, ListFilter, FileSearch],
	},
	lunch: {
		problem: LunchProblem,
		helps: LunchHelps,
		example: LunchExample,
		steps: [Split, Utensils, ArrowDownUp, BadgeCheck],
	},
	"backup-first": {
		problem: BackupProblem,
		helps: BackupHelps,
		example: BackupExample,
		steps: [Download, FolderOpen, RotateCcw, CloudUpload],
	},
	split: {
		problem: SplitProblem,
		helps: SplitHelps,
		example: SplitExample,
		steps: [ShoppingBasket, Gift, Tags, BadgeCheck],
	},
	repayment: {
		problem: RepaymentProblem,
		helps: RepaymentHelps,
		example: RepaymentExample,
		steps: [Users, ArrowDownUp, HandCoins, BadgeCheck],
	},
	treatments: {
		problem: TreatmentsProblem,
		helps: TreatmentsHelps,
		example: TreatmentsExample,
		check: TreatmentsCheck,
		steps: [TrendingUp, ArrowDownUp, PiggyBank, FileSearch],
	},
	pending: {
		problem: PendingProblem,
		helps: PendingHelps,
		example: PendingExample,
		check: PendingCheck,
		steps: [FileSearch, Utensils, CalendarRange, RefreshCw],
	},
	find: {
		problem: FindProblem,
		helps: FindHelps,
		example: FindExample,
		steps: [CalendarRange, Import, FileSearch, BadgeCheck],
	},
	categories: {
		problem: CategoriesProblem,
		helps: CategoriesHelps,
		example: CategoriesExample,
		steps: [Tags, ArrowDownUp, FileSearch, ChartColumn],
	},
	targets: {
		problem: TargetsProblem,
		helps: TargetsHelps,
		example: TargetsExample,
		check: TargetsCheck,
		steps: [CalendarRange, Repeat, Target, TrendingUp],
	},
	budgets: {
		problem: BudgetsProblem,
		helps: BudgetsHelps,
		example: BudgetsExample,
		steps: [Plane, Wallet, FileSearch, RefreshCw],
	},
	dashboard: {
		problem: DashboardProblem,
		helps: DashboardHelps,
		example: DashboardExample,
		check: DashboardCheck,
		steps: [CalendarRange, ChartColumn, FileSearch, TrendingUp],
	},
	sync: {
		problem: SyncProblem,
		helps: SyncHelps,
		example: SyncExample,
		steps: [Download, CloudUpload, RefreshCw, BadgeCheck],
	},
	routine: {
		problem: RoutineProblem,
		helps: RoutineHelps,
		example: RoutineExample,
		steps: [Import, Split, ChartColumn, Download],
	},
}
