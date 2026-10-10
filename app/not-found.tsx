import { ChartArea, MapPinOff, ReceiptText } from "lucide-react"
import Link from "next/link"
import PageContent from "@/components/layout/page-content"
import { Button } from "@/components/ui/button"
import { pathDashboard, pathRecords } from "@/routes"

/** Unmatched URLs: say so plainly and offer the way back, instead of silently landing elsewhere. */
export default function NotFound() {
	return (
		<PageContent className="min-h-[calc(100svh-var(--header-height))] items-center justify-center">
			<div className="reveal grid max-w-md justify-items-center gap-5 text-center">
				<span className="grid size-12 place-items-center rounded-xl border bg-card text-muted-foreground shadow-xs">
					<MapPinOff className="size-5" />
				</span>
				<div className="grid gap-2">
					<p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
						Error 404
					</p>
					<h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
						Page not found
					</h2>
					<p className="text-sm text-muted-foreground">
						This link doesn't lead anywhere in Finpoint. It may be mistyped or out of
						date. Your data is untouched; it stays in this browser.
					</p>
				</div>
				<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
					<Button asChild>
						<Link href={pathDashboard()}>
							<ChartArea /> Go to Dashboard
						</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href={pathRecords()}>
							<ReceiptText /> Browse Records
						</Link>
					</Button>
				</div>
			</div>
		</PageContent>
	)
}
