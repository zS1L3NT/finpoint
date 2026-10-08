import {
	ArrowDownUp,
	BadgeCheck,
	ChartColumn,
	CircleDollarSign,
	CircleHelp,
	CloudUpload,
	Download,
	Gift,
	HardDrive,
	House,
	Import,
	Landmark,
	ListFilter,
	Lock,
	type LucideIcon,
	PiggyBank,
	Plane,
	RefreshCw,
	RotateCcw,
	Search,
	Server,
	ShoppingBasket,
	Split,
	Tags,
	Target,
	TrendingUp,
	Users,
	Utensils,
	Wallet,
} from "lucide-react"
import { createContext, type FC, type ReactNode, useContext } from "react"
import { interpolate, useCurrentFrame } from "remotion"
import type { DemoKey, DemoScene } from "./demo"
import {
	At,
	BrowserWindow,
	Card,
	Chip,
	FileDoc,
	IconTile,
	Kicker,
	Link,
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
			<Link
				from="statement"
				to="record"
				fromSide="bottom"
				toSide="left"
				at={allocationAt}
				tag="−$12"
				tagAt={allocationAt + 10}
			/>
			<At x={0} y={40} w={470} anchor="statement">
				<Rise at={statementAt}>
					<StatementCard
						title={merchant}
						meta="OCBC · 3 Oct"
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
									Left to allocate
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
			<At x={482} y={300} w={470} anchor="record">
				<Rise at={recordAt}>
					<RecordCard
						title="Lunch"
						amount={-12}
						icon={Utensils}
						glow={0.3}
						chips={<Chip tint={color.pink}>Dining Out</Chip>}
						status={
							settled !== undefined && <Status pending={false} at={settled + 6} />
						}
					/>
				</Rise>
			</At>
		</>
	)
}

function StartProblem() {
	const bank = useAt("bank", 0)
	const really = useAt("really", 30)
	const rows: [string, string, number][] = [
		["NTUC FAIRPRICE", "OCBC · 5 Oct", -80],
		["SAKURA DINING", "OCBC · 10 Oct", -90],
		["PAYNOW FROM SAM TAN", "OCBC · 11 Oct", 60],
	]
	return (
		<>
			{rows.map(([title, meta, amount], index) => (
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
						</div>
					</Rise>
				</At>
			))}
		</>
	)
}

function StartHelps() {
	const bank = useAt("bring", 0)
	const explain = useAt("explain", 40, { nth: 1 })
	const show = useAt("see", 80)
	const columns: [string, LucideIcon, string, number][] = [
		["Bring in bank activity", Import, color.statement, bank],
		["Explain it", Tags, color.record, explain],
		["See where it went", ChartColumn, color.allocation, show],
	]
	const bars = [0.55, 0.8, 0.4, 0.95, 0.65]
	return (
		<>
			<Link from="step-0" to="step-1" at={explain} tint={color.record} pulses={false} />
			<Link from="step-1" to="step-2" at={show} tint={color.allocation} pulses={false} />
			{columns.map(([title, icon, tint, at], index) => (
				<At key={title} x={index * 333} y={20} w={286} anchor={`step-${index}`}>
					<Rise at={at}>
						<Card tint={tint} glow={0.2} style={{ padding: 26, height: 400 }}>
							<IconTile icon={icon} tint={tint} />
							<div style={{ fontSize: 30, fontWeight: 700, margin: "20px 0 18px" }}>
								{title}
							</div>
							{index === 0 &&
								[-80, -90, 60].map((amount, row) => (
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
								["Groceries", "Birthday gift", "Dinner share"].map((name, row) => (
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

function ModelHelps() {
	const statement = useAt("Statement", 0)
	const record = useAt("Record", 50)
	const allocation = useAt("Allocation", 100)
	const cards: [string, string, string, LucideIcon, number][] = [
		["Statement", "One row from your bank", color.statement, Import, statement],
		[
			"Allocation",
			"How much of a Statement belongs to a Record",
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
		</>
	)
}

function LunchProblem() {
	const statement = useAt("Statement", 0)
	const dashboard = useAt("Dashboard", 40)
	const record = useAt("Record", 70)
	return (
		<>
			<Link
				from="statement"
				to="dashboard"
				at={dashboard}
				tint={color.danger}
				dashed
				pulses={false}
			/>
			<At x={0} y={100} w={420} anchor="statement">
				<Rise at={statement}>
					<StatementCard title="KOPI & CO" amount={-12} meta="OCBC · 3 Oct" glow={0.3} />
				</Rise>
			</At>
			<At x={560} y={60} w={392} anchor="dashboard">
				<Rise at={dashboard}>
					<Tile
						label="Dashboard · Spending"
						value={<span style={font.numbers}>$0</span>}
						tint={color.spending}
						sub="Counts Records, not Statements"
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
		[-80, -30, 0],
	)
	return (
		<>
			<Link
				from="statement"
				to="groceries"
				fromSide="bottom"
				toSide="top"
				at={firstAt}
				tag="−$50"
				tagAt={firstAt + 10}
			/>
			<Link
				from="statement"
				to="gift"
				fromSide="bottom"
				toSide="top"
				at={secondAt}
				tag="−$30"
				tagAt={secondAt + 10}
			/>
			<At x={226} y={0} w={500} anchor="statement">
				<Rise at={statementAt}>
					<StatementCard
						title="NTUC FAIRPRICE"
						amount={-80}
						meta="OCBC · 5 Oct"
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
			<At x={0} y={330} w={440} anchor="groceries">
				<Rise at={firstAt + 14}>
					<RecordCard
						title="Groceries"
						amount={-50}
						icon={ShoppingBasket}
						chips={<Chip tint={color.pink}>Groceries</Chip>}
					/>
				</Rise>
			</At>
			<At x={512} y={330} w={440} anchor="gift">
				<Rise at={secondAt + 14}>
					<RecordCard
						title="Birthday gift"
						amount={-30}
						icon={Gift}
						chips={<Chip tint={color.pink}>Gifts</Chip>}
					/>
				</Rise>
			</At>
		</>
	)
}

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
			<Link
				from="dinner"
				to="record"
				toSide="left"
				at={recordAt}
				tag="−$90"
				tagAt={recordAt + 10}
			/>
			<Link
				from="paynow"
				to="record"
				toSide="left"
				at={backAt + 10}
				tint={color.income}
				tag="+$60"
				tagAt={backAt + 20}
			/>
			<At x={0} y={10} w={350} anchor="dinner">
				<Rise at={payAt}>
					<StatementCard title="DINNER" amount={-90} meta="10 Oct" compact />
				</Rise>
			</At>
			<At x={0} y={250} w={350} anchor="paynow">
				<Rise at={backAt}>
					<StatementCard
						title="PAYNOW"
						amount={60}
						meta="11 Oct"
						compact
						tint={color.income}
					/>
				</Rise>
			</At>
			<At x={572} y={110} w={380} anchor="record">
				<Rise at={recordAt}>
					<RecordCard
						title="Dinner with Sam"
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
							Your share
						</span>
					</div>
				</Rise>
			</At>
		</>
	)
}

function RepaymentProblem() {
	const pay = useAt("paid", 0)
	const back = useAt("back", 40)
	const own = useAt("really", 80)
	return (
		<>
			<At x={0} y={20} w={460} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
				<Rise at={pay} x={-30} y={0}>
					<StatementCard title="DINNER" amount={-90} meta="You pay for the table" />
				</Rise>
				<Rise at={back} x={-30} y={0}>
					<StatementCard
						title="PAYNOW"
						amount={60}
						meta="Sam pays you back"
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
						<Kicker tint={color.record}>What dinner really cost</Kicker>
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

const lanes: [string, LucideIcon, string][] = [
	["Income", TrendingUp, color.income],
	["Spending", ShoppingBasket, color.spending],
	["Saving/\u200binvestment", PiggyBank, color.saving],
	["Transfer/\u200bneutral", ArrowDownUp, color.neutral],
]

function TreatmentsHelps({ items: show = true }: { items?: boolean }) {
	const at = [
		useAt("Income", 0),
		useAt("Spending", 20),
		useAt("Saving", 40),
		useAt("Transfer", 60),
	]
	const items: [number, string, string][] = [
		[0, "Salary", "+$3,000"],
		[1, "Lunch", "−$12"],
		[1, "Refund", "+$20"],
		[2, "To savings", "−$500"],
		[3, "Own transfer", "$0"],
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
								{(show ? items : [])
									.filter(([lane]) => lane === index)
									.map(([, label, amount], row) => (
										<Pop key={label} at={(at[index] ?? 0) + 14 + row * 10}>
											<div
												style={{
													display: "flex",
													flexWrap: "wrap",
													justifyContent: "space-between",
													gap: "2px 10px",
													padding: "12px 14px",
													borderRadius: 14,
													fontSize: 21,
													fontWeight: 650,
													lineHeight: 1.25,
													background: alpha(tint, 0.16),
													boxShadow: `inset 0 0 0 1.5px ${alpha(tint, 0.4)}`,
													...font.numbers,
												}}
											>
												<span>{label}</span>
												<span style={{ whiteSpace: "nowrap" }}>
													{amount}
												</span>
											</div>
										</Pop>
									))}
							</div>
						</Card>
					</Rise>
				</At>
			))}
		</>
	)
}

function FindHelps() {
	const views: [string, string, LucideIcon, string, number][] = [
		["Records", "Your explanations", BadgeCheck, color.record, useAt("Records", 0)],
		[
			"Statements",
			"All your bank activity, even fully allocated",
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
	const trip = useAt("Budget", 0)
	const several = useAt("Bali", 40)
	return (
		<At x={0} y={30} w={952} style={{ display: "flex", flexDirection: "column", gap: 34 }}>
			<Rise at={trip}>
				<Card tint={color.pink} style={{ padding: 30 }}>
					<DateRange at={trip + 10} label="28 Oct → 4 Nov · its own start and end" />
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
	const amount = useAt("dashboard", 0)
	const dates = useAt("spent", 30)
	const attached = useAt("left", 50)
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
			<Link from="browser" to="drive" at={drive + 10} tint={color.record} />
			<Link
				from="browser"
				to="backup"
				at={backup + 6}
				tint={color.statement}
				pulses={false}
			/>
			<At x={0} y={20} w={330} anchor="browser">
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
			<At x={60} y={330} anchor="backup">
				<Rise at={backup + 16}>
					<FileDoc ext="JSON" name="Separate backup" tint={color.statement} size={0.85} />
				</Rise>
			</At>
			<At x={620} y={20} w={332}>
				<Rise at={drive}>
					<div data-anchor="drive">
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
					</div>
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

const routine: [string, LucideIcon, string][] = [
	["Import", Import, color.statement],
	["Explain", Split, color.allocation],
	["Check Pending", CircleDollarSign, color.pending],
	["Glance at Dashboard", ChartColumn, color.pink],
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
									background: `linear-gradient(145deg, ${alpha(tint, 0.32)}, ${alpha(tint, 0.1)}), ${color.night}`,
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

// ─── New scenes for the reorganised guide ──────────────────────────────────────────────

function StartSplit() {
	const start = useContext(BeatStart)
	const groceries = useAt("groceries", 50)
	const gift = useAt("gift", 80)
	const one = useAt("one", 120)
	return (
		<>
			<At x={0} y={30} w={400}>
				<Rise at={start}>
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
								["Groceries", "$50.00", groceries],
								["Birthday mug", "$30.00", gift],
							] as const
						).map(([name, price, at]) => (
							<Rise key={name} at={at} y={8}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										fontSize: 26,
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
			<At
				x={470}
				y={20}
				w={482}
				style={{ display: "flex", flexDirection: "column", gap: 18 }}
			>
				<Rise at={one}>
					<Kicker tint={color.statement}>What your bank shows</Kicker>
					<StatementCard
						title="NTUC FAIRPRICE"
						amount={-80}
						meta="One payment"
						compact
						style={{ marginTop: 10 }}
					/>
				</Rise>
				<Rise at={one + 30}>
					<Kicker tint={color.record}>What really happened</Kicker>
					<div style={{ display: "flex", gap: 12, marginTop: 12 }}>
						<Chip tint={color.record} size={30}>
							Groceries $50
						</Chip>
						<Chip tint={color.pink} size={30}>
							A gift $30
						</Chip>
					</div>
				</Rise>
			</At>
		</>
	)
}

function StartExplain() {
	const start = useContext(BeatStart)
	const rows: [string, number, string, number, string, string][] = [
		["NTUC FAIRPRICE", -80, "Groceries", -50, "groceries", color.record],
		["NTUC FAIRPRICE", 0, "Birthday gift", -30, "gift", color.pink],
		["SAKURA DINING", -90, "Dinner, my share", -30, "dinner-record", color.record],
	]
	const at = [useAt("groceries", 60), useAt("gift", 90), useAt("dinner", 120)]
	return (
		<>
			<At x={0} y={0} w={540} style={{ whiteSpace: "nowrap" }}>
				<Kicker tint={color.statement}>Your bank activity, untouched</Kicker>
			</At>
			<At x={560} y={0} w={392}>
				<Rise at={(at[0] ?? 0) - 10}>
					<Kicker tint={color.record}>Your explanations</Kicker>
				</Rise>
			</At>
			<At x={0} y={44} w={380} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
				<Rise at={start}>
					<div data-anchor="supermarket">
						<StatementCard title="NTUC FAIRPRICE" amount={-80} compact />
					</div>
				</Rise>
				<Rise at={start + 8} style={{ marginTop: 96 }}>
					<div data-anchor="dinner">
						<StatementCard title="SAKURA DINING" amount={-90} compact />
					</div>
				</Rise>
				<Rise at={start + 16}>
					<div data-anchor="paynow">
						<StatementCard
							title="PAYNOW FROM SAM"
							amount={60}
							compact
							tint={color.income}
						/>
					</div>
				</Rise>
			</At>
			{rows.map(([, , title, amount, key, tint], index) => (
				<At key={title} x={560} y={44 + index * 128} w={392} anchor={key}>
					<Rise at={at[index] ?? 0} x={30} y={0}>
						<RecordCard
							title={title}
							amount={amount}
							compact
							chips={<Chip tint={tint}>Record</Chip>}
						/>
					</Rise>
				</At>
			))}
			<Link from="supermarket" to="groceries" at={(at[0] ?? 0) + 4} pulses={false} />
			<Link from="supermarket" to="gift" at={(at[1] ?? 0) + 4} pulses={false} />
			<Link from="dinner" to="dinner-record" at={(at[2] ?? 0) + 4} pulses={false} />
			<Link
				from="paynow"
				to="dinner-record"
				at={(at[2] ?? 0) + 14}
				tint={color.income}
				pulses={false}
			/>
		</>
	)
}

function ModelStatement() {
	const start = useContext(BeatStart)
	const exactly = useAt("exactly", 40)
	return (
		<At x={176} y={90} w={600} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
			<Rise at={start}>
				<Kicker tint={color.statement}>Statement</Kicker>
			</Rise>
			<Rise at={start + 6}>
				<StatementCard
					title="NTUC FAIRPRICE BEDOK"
					amount={-80}
					meta="OCBC 360 Account · 5 Oct"
					glow={0.5}
				/>
			</Rise>
			<Rise at={exactly}>
				<div style={{ display: "flex", gap: 12 }}>
					<Chip tint={color.statement}>From your bank</Chip>
					<Chip tint={color.statement}>Never edited</Chip>
				</div>
			</Rise>
		</At>
	)
}

function ModelRecords() {
	const start = useContext(BeatStart)
	const groceries = useAt("Groceries", 40)
	const gift = useAt("gift", 80)
	return (
		<At x={176} y={40} w={600} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
			<Rise at={start}>
				<Kicker tint={color.record}>Records</Kicker>
			</Rise>
			<Rise at={groceries}>
				<RecordCard
					title="Groceries"
					amount={-50}
					icon={ShoppingBasket}
					glow={0.4}
					chips={<Chip tint={color.pink}>Groceries</Chip>}
				/>
			</Rise>
			<Rise at={gift}>
				<RecordCard
					title="Birthday gift"
					amount={-30}
					icon={Gift}
					glow={0.4}
					chips={<Chip tint={color.pink}>Gifts</Chip>}
				/>
			</Rise>
		</At>
	)
}

function PatternBadge({ at, children }: { at: number; children: ReactNode }) {
	return (
		<At x={0} y={470} w={952} style={{ display: "flex", justifyContent: "center" }}>
			<Pop at={at}>
				<Chip tint={color.allocation} size={28}>
					{children}
				</Chip>
			</Pop>
		</At>
	)
}

function ImportIntro() {
	const start = useContext(BeatStart)
	const download = useAt("download", 40)
	const bring = useAt("bring", 90)
	return (
		<>
			<At x={0} y={60} w={300} anchor="bank">
				<Rise at={start}>
					<BrowserWindow url="your bank" tint={color.statement} style={{ height: 300 }}>
						<div
							style={{
								padding: 26,
								display: "flex",
								flexDirection: "column",
								gap: 14,
							}}
						>
							<div style={{ fontSize: 24, fontWeight: 650 }}>Account activity</div>
							{[0, 1, 2].map(line => (
								<div
									key={line}
									style={{
										height: 14,
										borderRadius: 8,
										background: "rgba(255,255,255,0.1)",
										width: `${90 - line * 18}%`,
									}}
								/>
							))}
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 8,
									marginTop: 10,
									padding: "10px 16px",
									borderRadius: 12,
									background: color.ink,
									color: color.night,
									fontSize: 21,
									fontWeight: 700,
									width: "fit-content",
								}}
							>
								<Download size={20} /> Export
							</div>
						</div>
					</BrowserWindow>
				</Rise>
			</At>
			<Link from="bank" to="files" at={download} tint={color.statement} pulses={false} />
			<At x={380} y={70} w={240} anchor="files" style={{ display: "flex", gap: 10 }}>
				<Pop at={download + 10}>
					<FileDoc ext="CSV" tint={color.record} size={0.9} />
				</Pop>
				<Pop at={download + 18}>
					<FileDoc ext="XLS" tint={color.record} size={0.9} />
				</Pop>
			</At>
			<Link from="files" to="finpoint" at={bring} tint={color.record} pulses={false} />
			<At
				x={720}
				y={110}
				w={232}
				style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}
			>
				<Pop at={bring + 10}>
					<div data-anchor="finpoint">
						<IconTile icon={Import} tint={color.allocation} size={140} />
					</div>
				</Pop>
				<Rise at={bring + 20}>
					<div style={{ fontSize: 28, fontWeight: 700 }}>Finpoint</div>
				</Rise>
			</At>
		</>
	)
}

function AccountsScene() {
	const start = useContext(BeatStart)
	const ocbc = useAt("OCBC", 40)
	const uob = useAt("UOB", 70)
	const apart = useAt("apart", 120)
	const accounts: [string, string, number, [string, number][]][] = [
		[
			"360 Account",
			"OCBC · 601-234567-001",
			ocbc,
			[
				["KOPI & CO", -12],
				["NTUC FAIRPRICE", -80],
				["SALARY ACME", 3000],
			],
		],
		["Uniplus Savings", "UOB · 302-123456-7", uob, [["TRANSFER FROM OCBC", 500]]],
	]
	return (
		<>
			{accounts.map(([name, meta, at, rows], index) => (
				<At key={name} x={index * 488} y={20} w={464}>
					<Rise at={Math.max(start, at)}>
						<Card
							tint={color.statement}
							glow={0.2}
							style={{ padding: 24, minHeight: 420 }}
						>
							<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
								<IconTile icon={Wallet} tint={color.statement} size={56} />
								<div>
									<div style={{ fontSize: 28, fontWeight: 700 }}>{name}</div>
									<div style={{ fontSize: 20, color: color.dim }}>{meta}</div>
								</div>
							</div>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 10,
									marginTop: 22,
								}}
							>
								{rows.map(([title, amount], row) => (
									<Rise key={title} at={apart + row * 6 + index * 10} y={12}>
										<StatementCard
											title={title}
											amount={amount}
											compact
											meta={name}
										/>
									</Rise>
								))}
							</div>
						</Card>
					</Rise>
				</At>
			))}
		</>
	)
}

function DownloadStep() {
	const start = useContext(BeatStart)
	const each = useAt("each", 40)
	return (
		<At x={76} y={40} w={800} style={{ display: "flex", flexDirection: "column", gap: 26 }}>
			{(
				[
					["OCBC 360 Account", "ocbc-october.csv", "CSV"],
					["UOB Uniplus Savings", "uob-october.xls", "XLS"],
				] as const
			).map(([account, file, ext], index) => (
				<Rise key={file} at={(index ? each : start) + 4} x={-30} y={0}>
					<Card
						tint={color.statement}
						style={{
							padding: "20px 26px",
							display: "flex",
							alignItems: "center",
							gap: 24,
						}}
					>
						<IconTile icon={Wallet} tint={color.statement} size={60} />
						<div style={{ flex: 1, fontSize: 28, fontWeight: 650 }}>{account}</div>
						<Download size={30} color={color.dim} />
						<FileDoc ext={ext} name={file} tint={color.record} size={0.65} />
					</Card>
				</Rise>
			))}
			<Rise at={each + 20} style={{ alignSelf: "center" }}>
				<Chip tint={color.record} size={26}>
					One export per account
				</Chip>
			</Rise>
		</At>
	)
}

function DashFromRecords() {
	const start = useContext(BeatStart)
	const records = useAt("Records", 30)
	const never = useAt("never", 90)
	return (
		<>
			<At
				x={0}
				y={20}
				w={400}
				anchor="records"
				style={{ display: "flex", flexDirection: "column", gap: 14 }}
			>
				<Kicker tint={color.record}>Records</Kicker>
				{(
					[
						["Groceries", -50],
						["Birthday gift", -30],
						["Dinner with Sam", -30],
						["Salary", 3000],
					] as const
				).map(([title, amount], index) => (
					<Rise key={title} at={start + index * 6} x={-20} y={0}>
						<RecordCard title={title} amount={amount} compact />
					</Rise>
				))}
			</At>
			<Link from="records" to="tiles" at={records} tint={color.record} />
			<At
				x={580}
				y={60}
				w={372}
				anchor="tiles"
				style={{ display: "flex", flexDirection: "column", gap: 18 }}
			>
				<Rise at={records + 10}>
					<Tile
						label="Spending · October"
						tint={color.spending}
						value={<CountUp value={110} at={records + 10} signed={false} />}
					/>
				</Rise>
				<Rise at={records + 22}>
					<Tile
						label="Income · October"
						tint={color.income}
						value={<CountUp value={3000} at={records + 22} signed={false} />}
					/>
				</Rise>
				<Rise at={never}>
					<Chip tint={color.danger} size={22}>
						Statements alone don’t count
					</Chip>
				</Rise>
			</At>
		</>
	)
}

function PendingWhen() {
	const start = useContext(BeatStart)
	const anyway = useAt("anyway", 60)
	return (
		<>
			<At x={0} y={60} w={420}>
				<Rise at={start}>
					<Card tint={color.record} glow={0.3} style={{ padding: 28 }}>
						<Kicker tint={color.record}>Today</Kicker>
						<div style={{ fontSize: 30, fontWeight: 700, margin: "12px 0" }}>
							You know what happened
						</div>
						<RecordCard title="Concert with Jo" amount={-100} compact />
					</Card>
				</Rise>
			</At>
			<At x={520} y={60} w={432}>
				<Rise at={start + 20}>
					<Card
						style={{
							padding: 28,
							border: `2.5px dashed ${alpha(color.statement, 0.5)}`,
						}}
					>
						<Kicker tint={color.statement}>Next week</Kicker>
						<div style={{ fontSize: 30, fontWeight: 700, margin: "12px 0" }}>
							The bank catches up
						</div>
						<StatementCard
							title="PAYNOW FROM JO"
							amount={100}
							compact
							tint={color.income}
						/>
					</Card>
				</Rise>
			</At>
			<At x={0} y={400} w={952} style={{ display: "flex", justifyContent: "center" }}>
				<Pop at={anyway}>
					<Status pending />
				</Pop>
			</At>
		</>
	)
}

function SofaPending() {
	const start = useContext(BeatStart)
	const deposit = useAt("deposit", 20)
	const balance = useAt("balance", 50)
	const pending = useAt("Pending", 90)
	return (
		<>
			<Link from="deposit" to="sofa" toSide="left" at={deposit + 10} />
			<Link
				from="balance"
				to="sofa"
				toSide="left"
				at={balance + 10}
				dashed
				pulses={false}
				tint={color.pending}
			/>
			<At x={0} y={40} w={380} anchor="deposit">
				<Rise at={deposit}>
					<StatementCard title="SOFA DEPOSIT" amount={-50} compact meta="Paid today" />
				</Rise>
			</At>
			<At x={0} y={300} w={380} anchor="balance">
				<Rise at={balance}>
					<div
						style={{
							border: `2.5px dashed ${alpha(color.pending, 0.6)}`,
							borderRadius: 26,
						}}
					>
						<StatementCard
							title="Balance on delivery"
							amount={-150}
							compact
							meta="Not paid yet"
							pending
							style={{ background: "transparent", boxShadow: "none" }}
						/>
					</div>
				</Rise>
			</At>
			<At x={560} y={170} w={392} anchor="sofa">
				<Rise at={start}>
					<RecordCard
						title="Sofa"
						amount={-200}
						icon={House}
						glow={0.3}
						status={<Status pending at={pending} />}
					/>
				</Rise>
			</At>
		</>
	)
}

function PendingGap() {
	const start = useContext(BeatStart)
	const days = useAt("days", 30)
	const placeholder = useAt("placeholder", 100)
	return (
		<>
			<At x={0} y={40} w={400}>
				<Rise at={start}>
					<Card
						tint={color.record}
						style={{ padding: 28, display: "flex", alignItems: "center", gap: 20 }}
					>
						<IconTile icon={Wallet} tint={color.record} size={70} />
						<div>
							<div style={{ fontSize: 22, color: color.dim }}>Today, by card</div>
							<div
								style={{
									...big,
									...font.numbers,
									fontSize: 36,
									whiteSpace: "nowrap",
								}}
							>
								−$35 burger
							</div>
						</div>
					</Card>
				</Rise>
			</At>
			<At x={480} y={40} w={472}>
				<Rise at={days}>
					<Card
						style={{
							padding: 28,
							display: "flex",
							alignItems: "center",
							gap: 20,
							opacity: 0.7,
						}}
					>
						<IconTile icon={Landmark} tint={color.statement} size={70} />
						<div>
							<div style={{ fontSize: 22, color: color.dim }}>Bank export</div>
							<div style={{ fontSize: 34, fontWeight: 700 }}>
								Shows it in 2–3 days
							</div>
						</div>
					</Card>
				</Rise>
			</At>
			<At x={176} y={260} w={600}>
				<Rise at={placeholder}>
					<div
						style={{
							border: `2.5px dashed ${alpha(color.pending, 0.7)}`,
							borderRadius: 26,
						}}
					>
						<StatementCard
							title="Burger with Mia"
							amount={-35}
							pending
							glow={0.4}
							style={{ background: "transparent" }}
						/>
					</div>
				</Rise>
			</At>
		</>
	)
}

function CategoryExamples() {
	const start = useContext(BeatStart)
	const groups: [string, string[], string, number][] = [
		["Dining Out", ["Lunch", "Dinner with Sam"], color.pink, useAt("Dining", 10)],
		["Groceries", ["Supermarket run"], color.record, useAt("Groceries", 50)],
		["Gifts & Donations", ["Birthday gift"], color.allocation, useAt("Gifts", 80)],
	]
	const own = useAt("own", 130)
	return (
		<>
			{groups.map(([name, items, tint, at], index) => (
				<At key={name} x={index * 324} y={20} w={304}>
					<Rise at={Math.max(start, at)} y={40}>
						<Card tint={tint} glow={0.3} style={{ padding: 16, minHeight: 330 }}>
							<Kicker tint={tint}>Category</Kicker>
							<div
								style={{
									fontSize: 32,
									fontWeight: 750,
									lineHeight: 1.15,
									margin: "10px 0 18px",
									textWrap: "balance",
								}}
							>
								{name}
							</div>
							<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
								{items.map((item, row) => (
									<Pop key={item} at={at + 12 + row * 8}>
										<RecordCard title={item} compact />
									</Pop>
								))}
							</div>
						</Card>
					</Rise>
				</At>
			))}
			<At
				x={0}
				y={400}
				w={952}
				style={{ display: "flex", justifyContent: "center", gap: 12 }}
			>
				<Rise at={own}>
					<Chip tint={color.ink} size={26}>
						Rename them, or add your own
					</Chip>
				</Rise>
			</At>
		</>
	)
}

function BucketsScene() {
	const start = useContext(BeatStart)
	const buckets: [string, string[], string, number][] = [
		["Daily", ["Groceries", "Dining Out", "Transport"], "#38bdf8", useAt("Daily", 20)],
		["Recurring", ["Bills", "Housing"], color.allocation, useAt("Recurring", 40)],
		["Irregular", ["Shopping", "Healthcare"], "#fbbf24", useAt("Irregular", 60)],
		["Travel", ["Travel"], color.pink, useAt("Travel", 80)],
	]
	return (
		<>
			{buckets.map(([name, categories, tint, at], index) => (
				<At key={name} x={index * 240} y={40} w={224}>
					<Rise at={Math.max(start, at)} y={40}>
						<Card tint={tint} glow={0.25} style={{ padding: 22, height: 380 }}>
							<IconTile icon={Target} tint={tint} size={56} />
							<div style={{ fontSize: 30, fontWeight: 750, margin: "16px 0 6px" }}>
								{name}
							</div>
							<div style={{ fontSize: 19, color: color.dim, marginBottom: 16 }}>
								Monthly plan
							</div>
							<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
								{categories.map(category => (
									<Chip key={category} tint={tint} size={19}>
										{category}
									</Chip>
								))}
							</div>
						</Card>
					</Rise>
				</At>
			))}
		</>
	)
}

function LocalOnly() {
	const start = useContext(BeatStart)
	const server = useAt("database", 40)
	const never = useAt("never", 90)
	const cross = useProgress(never, 20)
	return (
		<>
			<At x={0} y={40} w={460} anchor="browser">
				<Rise at={start}>
					<BrowserWindow
						url="This browser · this device"
						tint={color.record}
						style={{ height: 380 }}
					>
						<div
							style={{
								padding: 32,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 18,
							}}
						>
							<IconTile icon={HardDrive} tint={color.record} size={110} />
							<div style={{ fontSize: 30, fontWeight: 700 }}>Your Finpoint data</div>
							<Chip tint={color.record}>
								<Lock size={18} /> Stays here
							</Chip>
						</div>
					</BrowserWindow>
				</Rise>
			</At>
			<Link
				from="browser"
				to="server"
				at={server}
				dashed
				pulses={false}
				tint={color.danger}
			/>
			<At
				x={620}
				y={90}
				w={332}
				style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
			>
				<Rise at={server}>
					<div
						data-anchor="server"
						style={{ position: "relative", opacity: 1 - cross * 0.4 }}
					>
						<IconTile icon={Server} tint={color.neutral} size={140} />
						<svg
							viewBox="0 0 140 140"
							width={140}
							height={140}
							style={{ position: "absolute", inset: 0 }}
							aria-hidden
						>
							<path
								d="M 20 20 L 120 120"
								stroke={color.danger}
								strokeWidth={10}
								strokeLinecap="round"
								pathLength={1}
								strokeDasharray="1 1"
								strokeDashoffset={1 - cross}
							/>
						</svg>
					</div>
				</Rise>
				<Rise at={server + 10}>
					<div style={{ fontSize: 26, fontWeight: 650, textAlign: "center" }}>
						No Finpoint database
					</div>
				</Rise>
			</At>
		</>
	)
}

function YourPlaces() {
	const start = useContext(BeatStart)
	const places: [string, LucideIcon][] = [
		["This browser", HardDrive],
		["Your backup file", Download],
		["Your Google Drive", CloudUpload],
	]
	return (
		<>
			{places.map(([label, icon], index) => (
				<At
					key={label}
					x={index * 324}
					y={90}
					w={304}
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 18,
						textAlign: "center",
					}}
				>
					<Pop at={start + index * 10}>
						<IconTile icon={icon} tint={color.record} size={130} />
					</Pop>
					<Rise at={start + 6 + index * 10}>
						<div style={{ fontSize: 30, fontWeight: 700 }}>{label}</div>
						<div style={{ marginTop: 12 }}>
							<Chip tint={color.record}>
								<Lock size={18} /> Yours
							</Chip>
						</div>
					</Rise>
				</At>
			))}
		</>
	)
}

function BackupChoice() {
	const drive = useAt("Drive", 0)
	const file = useAt("download", 50)
	return (
		<>
			<At x={40} y={50} w={420}>
				<Rise at={drive}>
					<Card tint={color.record} glow={0.4} style={{ padding: 30, height: 340 }}>
						<IconTile icon={CloudUpload} tint={color.record} size={80} />
						<div style={{ fontSize: 32, fontWeight: 750, marginTop: 20 }}>
							Google Drive
						</div>
						<div style={{ fontSize: 24, color: color.dim, marginTop: 8 }}>
							Backed up automatically
						</div>
						<div style={{ marginTop: 22 }}>
							<SyncStatus at={drive + 20} />
						</div>
					</Card>
				</Rise>
			</At>
			<At x={492} y={50} w={420}>
				<Rise at={file}>
					<Card tint={color.statement} style={{ padding: 30, height: 340 }}>
						<IconTile icon={Download} tint={color.statement} size={80} />
						<div style={{ fontSize: 32, fontWeight: 750, marginTop: 20 }}>
							Backup file
						</div>
						<div style={{ fontSize: 24, color: color.dim, marginTop: 8 }}>
							Download one every so often
						</div>
					</Card>
				</Rise>
			</At>
		</>
	)
}

function HelpEverywhere() {
	const start = useContext(BeatStart)
	const chapters = useAt("chapter", 60)
	const titles = [
		"Why Finpoint?",
		"Statements, Records and Allocations",
		"Splitting one payment",
		"Pending Records",
		"Budgets for trips",
	]
	return (
		<>
			<At
				x={60}
				y={110}
				w={260}
				style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
			>
				<Pop at={start}>
					<IconTile icon={CircleHelp} tint={color.allocation} size={170} />
				</Pop>
				<Rise at={start + 10}>
					<div style={{ fontSize: 30, fontWeight: 700 }}>Help</div>
				</Rise>
			</At>
			<At
				x={400}
				y={40}
				w={552}
				style={{ display: "flex", flexDirection: "column", gap: 12 }}
			>
				{titles.map((title, index) => (
					<Rise key={title} at={chapters + index * 6} x={30} y={0}>
						<Card
							style={{
								padding: "16px 22px",
								display: "flex",
								alignItems: "center",
								gap: 16,
							}}
						>
							<span style={{ ...font.numbers, color: color.faint, fontSize: 22 }}>
								{String(index + 1).padStart(2, "0")}
							</span>
							<span style={{ fontSize: 25, fontWeight: 600 }}>{title}</span>
						</Card>
					</Rise>
				))}
			</At>
		</>
	)
}

// ─── Registry ──────────────────────────────────────────────────────────────────────────

/** A beat's picture: an illustrated scene, or a filmed walk through real Finpoint screens. */
export type SceneEntry = Beat | { demo: DemoScene }

const demo = (take: string, keys: DemoKey[]): SceneEntry => ({ demo: { take, keys } })

export const scenes: Record<string, Record<string, SceneEntry>> = {
	start: {
		bank: StartProblem,
		split: StartSplit,
		dinner: RepaymentProblem,
		explain: StartExplain,
		built: StartHelps,
	},
	model: {
		three: ModelHelps,
		statement: ModelStatement,
		record: ModelRecords,
		allocation: () => (
			<SplitFlow
				statementAt={useAt("Statement", 0)}
				firstAt={useAt("Groceries", 40)}
				secondAt={useAt("gift", 80)}
			/>
		),
		split: () => (
			<>
				<SplitFlow
					statementAt={useContext(BeatStart)}
					firstAt={useContext(BeatStart) + 6}
					secondAt={useContext(BeatStart) + 12}
				/>
				<PatternBadge at={useAt("one", 10)}>1 Statement → several Records</PatternBadge>
			</>
		),
		combine: () => (
			<>
				<RepaymentFlow
					payAt={useAt("$90", 10)}
					backAt={useAt("$60", 40)}
					recordAt={useAt("Dinner", 60)}
					totalAt={useAt("share", 100)}
				/>
				<PatternBadge at={useAt("combined", 30)}>
					Several Statements → 1 Record
				</PatternBadge>
			</>
		),
		simple: () => (
			<LunchFlow
				statementAt={useAt("Statement", 20)}
				recordAt={useAt("Lunch", 50, { nth: 1 })}
				allocationAt={useAt("explained", 60)}
			/>
		),
	},
	import: {
		intro: ImportIntro,
		banks: demo("import", [
			{ hold: "start", focus: "card" },
			{ at: "DBS", hold: "start", focus: "banks", highlight: "banks" },
		]),
		accounts: AccountsScene,
		revolut: demo("revolut", [
			{ hold: "start", focus: "banks" },
			{ at: "Revolut", play: "account", focus: "banks" },
			{ at: "pick", hold: "account", focus: "banks", highlight: "account" },
		]),
		download: DownloadStep,
		choose: demo("import", [
			{ hold: "start", focus: "card" },
			{ at: 0, play: "bank", focus: "card", speed: 1.3 },
			{ at: "add", play: "files", focus: "card", speed: 1.6 },
		]),
		result: demo("import", [
			{ hold: "files", focus: "card" },
			{ at: "Import", play: "result" },
			{ at: "check", hold: "result", highlight: "result" },
		]),
		next: demo("import", [
			{ hold: "result", highlight: "allocate" },
			{ at: "waiting", play: "allocator" },
		]),
	},
	allocator: {
		list: demo("allocator", [{ hold: "start" }, { at: "lists", play: "scrolled" }]),
		left: demo("split", [
			{ hold: "left" },
			{
				at: "left",
				hold: "left",
				highlight: "allocable",
				note: { box: "allocable", text: "Left to allocate" },
			},
		]),
		pages: FindHelps,
	},
	lunch: {
		select: demo("lunch", [
			{ hold: "start" },
			{ at: "lunch", play: "row" },
			{ at: "click", play: "selected" },
			{ at: "bar", hold: "selected", highlight: "bar" },
		]),
		create: demo("lunch", [
			{ hold: "selected", highlight: "create" },
			{ at: "Create", play: "creator" },
			{ at: "attached", hold: "creator", highlight: "attached" },
			{ at: "amount", hold: "creator", highlight: "amount" },
		]),
		fill: demo("lunch", [{ hold: "creator" }, { at: 0, play: "filled", speed: 1.6 }]),
		ignore: demo("lunch", [
			{ hold: "filled" },
			{ at: "Treatment", play: "analytics", focus: "analytics" },
			{
				at: "Category",
				hold: "analytics",
				focus: "analytics",
				highlight: "analytics",
				note: { box: "analytics", text: "Filled in by your Category" },
			},
		]),
		save: demo("lunch", [
			{ hold: "analytics", focus: "analytics" },
			{ at: "save", play: "saved" },
		]),
	},
	split: {
		select: demo("split", [{ hold: "start" }, { at: "Select", play: "creator" }]),
		amount: demo("split", [
			{ hold: "creator" },
			{ at: "Call", play: "filled", speed: 1.5 },
			{
				at: "unexplained",
				hold: "filled",
				highlight: ["amount", "allocation"],
				note: { box: "allocation", text: "$50 of $80" },
			},
		]),
		left: demo("split", [
			{ hold: "filled" },
			{ at: "Save", play: "left", speed: 1.2 },
			{ at: "left", hold: "left", highlight: "allocable" },
		]),
		gift: demo("split", [
			{ hold: "left" },
			{ at: "Select", play: "gift", speed: 1.5 },
			{
				at: "fills",
				hold: "gift",
				highlight: "allocation",
				note: { box: "allocation", text: "$30 left to allocate" },
			},
		]),
		done: () => (
			<SplitFlow
				statementAt={useContext(BeatStart)}
				firstAt={useAt("$50", 20)}
				secondAt={useAt("gift", 50)}
			/>
		),
	},
	repayment: {
		select: demo("combine", [
			{ hold: "start" },
			{ at: "Allocator", play: "rows" },
			{ at: "$90", play: "dinner" },
			{ at: "$60", play: "selected" },
			{ at: "total", hold: "selected", highlight: "bar" },
		]),
		create: demo("combine", [
			{ hold: "selected" },
			{ at: "Choose", play: "filled", speed: 1.5 },
			{
				at: "comes",
				hold: "filled",
				highlight: ["attached", "amount"],
				note: { box: "amount", text: "−$90 + $60 = −$30" },
			},
		]),
		done: () => (
			<RepaymentFlow
				payAt={useContext(BeatStart)}
				backAt={useContext(BeatStart) + 10}
				recordAt={useAt("single", 20)}
				totalAt={useAt("$30", 60)}
			/>
		),
	},
	dashboard: {
		records: DashFromRecords,
		empty: LunchProblem,
		real: demo("dashboard", [
			{ hold: "start" },
			{ at: "spent", play: "spending", focus: "metrics", highlight: "spending" },
		]),
		categories: demo("dashboard", [
			{ hold: "spending", focus: "metrics" },
			{ at: "broken", play: "breakdown" },
			{ at: "Categories", hold: "breakdown", highlight: "mix" },
		]),
	},
	pending: {
		when: PendingWhen,
		concert: demo("pending", [
			{ hold: "start" },
			{ at: "$200", play: "creator", speed: 1.2 },
			{ at: "back", play: "flag", speed: 1.6 },
			{ at: "share", hold: "flag", highlight: ["amount", "attached"] },
		]),
		flag: demo("pending", [
			{ hold: "flag", highlight: ["amount", "attached"] },
			{ at: "warns", hold: "flag", focus: "pending", highlight: "pending" },
		]),
		list: demo("pending", [
			{ hold: "flag" },
			{ at: 0, play: "records", speed: 1.5 },
			{
				at: "marked",
				hold: "records",
				highlight: "badge",
				note: { box: "badge", text: "Waiting for the rest" },
			},
		]),
		attach: demo("attach", [
			{ hold: "start" },
			{ at: "select", play: "selected" },
			{ at: "Attach", play: "sheet" },
			{ at: "suggests", hold: "sheet", highlight: "concert" },
		]),
		complete: demo("attach", [
			{ hold: "sheet" },
			{ at: 0, play: "editor" },
			{ at: "combines", hold: "editor", highlight: "attached" },
		]),
		meaning: SofaPending,
	},
	"pending-statements": {
		why: PendingGap,
		create: demo("placeholder", [
			{ hold: "start", highlight: "create" },
			{ at: 0, play: "filled", speed: 1.7 },
			{ at: "description", hold: "filled", highlight: ["account", "amount", "description"] },
		]),
		explain: demo("placeholder", [
			{ hold: "filled" },
			{ at: 0, play: "allocator", speed: 1.2 },
			{
				at: "marked",
				hold: "allocator",
				highlight: "badge",
				note: { box: "badge", text: "Counts now, stays Pending" },
			},
		]),
		replace: demo("replace", [
			{ hold: "start" },
			{ at: "open", play: "candidates" },
			{ at: "suggests", hold: "candidates", highlight: "candidate" },
		]),
		review: demo("replace", [
			{ hold: "candidates", highlight: "replace" },
			{ at: "Choose", play: "review" },
			{ at: "disappears", play: "done" },
		]),
	},
	categories: {
		most: demo("categories", [{ hold: "start" }, { at: "Dashboard", play: "hover" }]),
		examples: CategoryExamples,
		defaults: demo("categories", [
			{ hold: "hover" },
			{ at: "Category", play: "defaults" },
			{ at: "treatment", hold: "defaults", highlight: "defaults" },
		]),
	},
	treatments: {
		what: () => <TreatmentsHelps items={false} />,
		examples: () => <TreatmentsHelps />,
		override: demo("lunch", [
			{ hold: "analytics", focus: "analytics", highlight: "analytics" },
		]),
	},
	buckets: {
		what: BucketsScene,
		daily: TargetsCheck,
		target: demo("buckets", [
			{ hold: "start" },
			{ at: "Give", play: "target", speed: 1.5 },
			{ at: "one", play: "scope", speed: 1.3 },
			{ at: "onward", hold: "scope", highlight: "applies" },
		]),
		compare: demo("buckets", [
			{ hold: "scope" },
			{ at: 0, play: "saved" },
			{ at: "target", hold: "saved", highlight: "daily" },
		]),
	},
	budgets: {
		what: BudgetsProblem,
		create: demo("budgets", [
			{ hold: "start" },
			{ at: "Create", play: "dates", speed: 1.3 },
			{ at: "Automatic", play: "automatic" },
			{ at: "attached", hold: "automatic", highlight: "automatic" },
		]),
		own: BudgetsHelps,
	},
	sync: {
		local: LocalOnly,
		file: demo("data", [
			{ hold: "start", highlight: "file" },
			{ at: "Download", play: "download", highlight: "download" },
		]),
		drive: SyncHelps,
		yours: YourPlaces,
	},
	routine: {
		loop: () => (
			<Loop
				at={[
					useAt("Import", 0),
					useAt("Explain", 30),
					useAt("Check", 60),
					useAt("glance", 90),
					useAt("backup", 150),
				]}
			/>
		),
		backup: BackupChoice,
		help: HelpEverywhere,
	},
}
