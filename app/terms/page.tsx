import type { Metadata } from "next"
import Link from "next/link"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pathPrivacy } from "@/routes"

const SECTIONS: { heading: string; body: string[] }[] = [
	{
		heading: "The service",
		body: [
			"Finpoint is a free, local-first personal finance tracker: it records imported account activity (statements) and the entries that explain it (records), plus budgets, categories, and spending buckets. It is provided as-is, for personal, non-commercial use.",
			"By using Finpoint you agree to these terms. If you do not agree, do not use it.",
		],
	},
	{
		heading: "No account, your responsibility",
		body: [
			"There is no account to create, recover, or delete. Your data lives only in your browser until you back it up, so you are responsible for keeping copies that matter: download backup files and sync before switching or clearing devices.",
			"Demo data and Clear all data replace everything in the browser. They cannot be undone except from your own backup.",
		],
	},
	{
		heading: "How sync behaves",
		body: [
			"Google Drive sync copies the whole dataset at once — it does not merge individual edits. Writing overwrites the Drive copy; reading replaces this browser. If both sides changed since the last sync, you must pick a winner; the loser is replaced.",
			"Sync before switching devices. Do not treat either copy as version history: keep your own backup files for anything irreplaceable.",
		],
	},
	{
		heading: "Not financial advice",
		body: [
			"Finpoint organizes numbers you enter or import. It is not a bank, broker, tax advisor, or financial advisor, and nothing it shows is financial, investment, tax, or legal advice. Verify important figures against your own records and consult a qualified professional before acting on them.",
		],
	},
	{
		heading: "Acceptable use",
		body: [
			"Use Finpoint lawfully and only as intended: do not attempt to disrupt it, probe other people's data, misrepresent the app, or use it for anything unlawful. Imported bank data you handle in the app remains subject to your own agreements with your bank.",
		],
	},
	{
		heading: "Intellectual property",
		body: [
			"The app, its design, and its code belong to their respective owners and are protected by applicable intellectual-property laws. You receive a limited, personal, non-transferable, revocable license to use Finpoint for yourself — not to copy, resell, or pass it off as your own.",
		],
	},
	{
		heading: "Third-party services",
		body: [
			"Optional features rely on third parties with their own terms: Google (Drive sync and sign-in) and the hosting and telemetry providers that deliver the app. Your use of those features is also governed by those providers' terms and policies.",
		],
	},
	{
		heading: "Warranty disclaimer",
		body: [
			"To the maximum extent permitted by law, Finpoint is provided “as is” and “as available,” without warranties of any kind — express, implied, or statutory — including accuracy, reliability, availability, fitness for a particular purpose, and non-infringement. In particular, we do not warrant that your data will survive browser clears, device loss, or failed syncs: that is what backups are for.",
		],
	},
	{
		heading: "Limitation of liability",
		body: [
			"To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, consequential, or punitive damages — including lost data, lost profits, or financial decisions made using the app — even if advised of the possibility. Our total liability for any claim is limited to what you paid for the service: nothing, since it is free.",
		],
	},
	{
		heading: "Indemnification",
		body: [
			"You agree to indemnify and hold us harmless from claims, damages, and expenses (including reasonable legal fees) arising from your misuse of the service or violation of these terms.",
		],
	},
	{
		heading: "Changes and ending use",
		body: [
			"We may update these terms; material changes will be noted in the app with an updated date below, and continued use means acceptance. You may stop using Finpoint at any time — there is no account to cancel. Clearing the browser's site data removes your local data.",
		],
	},
	{
		heading: "General",
		body: [
			"If any provision is found unenforceable, the rest remain in effect. These documents are templates, not legal advice — have them reviewed by a lawyer, and replace this paragraph with your governing law and contact details before a public release.",
		],
	},
]

export const metadata: Metadata = {
	title: "Terms of Service",
	description: "The rules for using Finpoint, the local-first finance tracker.",
}

export default function TermsPage() {
	return (
		<>
			<AppHeader title="Terms of Service" />

			<PageContent>
				<PageHeader
					title="Terms of Service"
					subtitle="The short version: free tool, your data, your backups, not financial advice."
					description="Legal"
					icon="lucide:scroll-text"
				/>

				<div className="grid max-w-5xl gap-6">
					<Card>
						<CardHeader className="border-b">
							<CardTitle>Last updated September 15, 2026</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{SECTIONS.map(section => (
								<section key={section.heading} className="space-y-2">
									<h2 className="text-sm font-semibold">{section.heading}</h2>
									{section.body.map(paragraph => (
										<p
											key={paragraph.slice(0, 32)}
											className="text-sm text-muted-foreground"
										>
											{paragraph}
										</p>
									))}
								</section>
							))}
							<p className="border-t pt-4 text-sm text-muted-foreground">
								Related:{" "}
								<Link href={pathPrivacy()} className="underline">
									Privacy Policy
								</Link>
							</p>
						</CardContent>
					</Card>
				</div>
			</PageContent>
		</>
	)
}
