import {
	AppleIcon,
	ArrowLeftRightIcon,
	BikeIcon,
	BookOpenIcon,
	CardSimIcon,
	CarTaxiFrontIcon,
	ChartCandlestickIcon,
	CircleQuestionMarkIcon,
	CoffeeIcon,
	CpuIcon,
	CupSodaIcon,
	DollarSignIcon,
	FilmIcon,
	FolderCodeIcon,
	FootprintsIcon,
	GiftIcon,
	GuitarIcon,
	HandCoinsIcon,
	HandshakeIcon,
	HatGlassesIcon,
	HeartIcon,
	HeartPulseIcon,
	HospitalIcon,
	IceCreamBowlIcon,
	IdCardIcon,
	type LucideIcon,
	MirrorRoundIcon,
	MonitorSmartphoneIcon,
	NavigationIcon,
	PartyPopperIcon,
	PlaneIcon,
	ScissorsIcon,
	ShirtIcon,
	ShoppingBagIcon,
	SoupIcon,
	TicketIcon,
	ToolboxIcon,
	TrainFrontIcon,
	UtensilsIcon,
	WarehouseIcon,
	WineIcon,
} from "lucide-react"

export const CATEGORY_ICONS = {
	cpu: CpuIcon,
	"monitor-smartphone": MonitorSmartphoneIcon,
	"card-sim": CardSimIcon,
	"folder-code": FolderCodeIcon,
	"circle-question-mark": CircleQuestionMarkIcon,
	"arrow-left-right": ArrowLeftRightIcon,
	"dollar-sign": DollarSignIcon,
	"hand-coins": HandCoinsIcon,
	gift: GiftIcon,
	"chart-candlestick": ChartCandlestickIcon,
	handshake: HandshakeIcon,
	navigation: NavigationIcon,
	plane: PlaneIcon,
	bike: BikeIcon,
	"car-taxi-front": CarTaxiFrontIcon,
	"train-front": TrainFrontIcon,
	"heart-pulse": HeartPulseIcon,
	"mirror-round": MirrorRoundIcon,
	scissors: ScissorsIcon,
	hospital: HospitalIcon,
	"shopping-bag": ShoppingBagIcon,
	"hat-glasses": HatGlassesIcon,
	shirt: ShirtIcon,
	footprints: FootprintsIcon,
	utensils: UtensilsIcon,
	apple: AppleIcon,
	coffee: CoffeeIcon,
	soup: SoupIcon,
	wine: WineIcon,
	"ice-cream-bowl": IceCreamBowlIcon,
	"cup-soda": CupSodaIcon,
	"party-popper": PartyPopperIcon,
	warehouse: WarehouseIcon,
	"book-open": BookOpenIcon,
	ticket: TicketIcon,
	toolbox: ToolboxIcon,
	guitar: GuitarIcon,
	"id-card": IdCardIcon,
	heart: HeartIcon,
	film: FilmIcon,
} satisfies Record<string, LucideIcon>

export type CategoryIconName = keyof typeof CATEGORY_ICONS

export const FALLBACK_CATEGORY_ICON: CategoryIconName = "circle-question-mark"

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS) as CategoryIconName[]

export function isCategoryIconName(icon: string): icon is CategoryIconName {
	return icon in CATEGORY_ICONS
}

export default function Icon({
	icon,
	color,
	size = 20,
}: {
	icon: string
	color: string
	size?: number
}) {
	const CategoryIcon = CATEGORY_ICONS[isCategoryIconName(icon) ? icon : FALLBACK_CATEGORY_ICON]

	return (
		<div
			className="flex justify-center items-center rounded"
			style={{ width: size * 2, height: size * 2, backgroundColor: color }}
		>
			<CategoryIcon color="white" size={size} />
		</div>
	)
}
