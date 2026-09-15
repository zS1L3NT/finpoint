import { Link } from "react-router-dom"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pathTerms } from "@/routes"

const SECTIONS: { heading: string; body: string[] }[] = [
	{
		heading: "Overview",
		body: [
			"Finpoint is a local-first personal finance tracker. There is no Finpoint account, no Finpoint server, and no database of yours on our side. Your financial entries live in your own browser's storage (IndexedDB) on your own device.",
			"We collect, receive, and store none of your financial data. What little technical data is processed to deliver the app is described below.",
		],
	},
	{
		heading: "Financial data stays on your device",
		body: [
			"Accounts, statements, records, allocations, budgets, categories, and spending buckets are saved only in this browser on this device. They are never uploaded to us, because there is nowhere to upload them to — the app has no backend.",
			"Clearing your browser's site data deletes this data. Uninstalling or resetting the browser does the same. Keep a backup if the data matters to you.",
		],
	},
	{
		heading: "Backups you control",
		body: [
			"Backup file (download / restore): the file you download contains everything above in plain JSON. It goes wherever you put it — your disk, your cloud, your messages. Whoever holds the file can read it, so treat it like a bank statement.",
			"Google Drive sync (optional): if you connect it, the app writes the same plain-JSON backup to a hidden app folder in your own Google Drive and reads it back on your other devices. The file is not encrypted beyond what Google Drive itself provides, so Google — like anyone with access to your Drive — could read it. It is your Drive, under your Google account and Google's Privacy Policy.",
			"Drive sign-in uses Google with the minimum scope needed (access to the app's own folder only, not your whole Drive). The access token lives only in your browser's memory while syncing and is sent only to Google. We never receive it and cannot access your Drive.",
		],
	},
	{
		heading: "Technical data processed to run the app",
		body: [
			"Hosting: the app is served as static files. Our hosting provider necessarily processes standard connection data (such as IP address) to deliver the page, per its own privacy policy.",
			"Usage telemetry: the app includes Vercel Analytics and Speed Insights, which collect aggregate, privacy-friendly telemetry such as pages visited and page-load performance. They do not receive your financial data. See Vercel's Privacy Policy for details.",
			"Google scripts: connecting Drive sync loads Google's sign-in library from Google's servers; Google may process technical data per its policies at that point.",
			"We set no cookies of our own, run no ads, and sell no data — there is nothing to sell.",
		],
	},
	{
		heading: "Your control",
		body: [
			"Access and delete everything locally at any time: use Clear all data in Settings, clear the browser's site data, disconnect Google Drive, or delete the backup file from your Drive's app folder.",
			"Because we hold no copy of your data, there is nothing for us to export or erase on request — that is the point of the design.",
		],
	},
	{
		heading: "Security and its limits",
		body: [
			"Traffic is encrypted in transit (HTTPS). Beyond that, your data's safety rests on your device and accounts: use your operating system's screen lock, keep your browser and Google account secure, and back up before switching devices.",
			"Sync replaces the whole dataset, not individual edits — see the Terms of Service. Review what sync will do before confirming.",
		],
	},
	{
		heading: "Children",
		body: [
			"Finpoint is a general personal-finance tool not directed at children. If you are under the age required to consent to data processing where you live, please have a parent or guardian review this policy with you.",
		],
	},
	{
		heading: "Changes",
		body: [
			"If this policy changes materially, we will update the date below and note it in the app. Continued use after a change means you accept the updated policy.",
		],
	},
	{
		heading: "Contact",
		body: [
			"Questions about this policy: contact the person or repository that provided you this copy of Finpoint. These documents are templates, not legal advice — have them reviewed by a lawyer before relying on them for a public release.",
		],
	},
]

export default function PrivacyPage() {
	return (
		<>
			<AppHeader title="Privacy Policy" />

			<PageContent>
				<PageHeader
					title="Privacy Policy"
					subtitle="Your money stays in your browser. This page explains the little that leaves it, and why."
					description="Legal"
					icon="lucide:shield-check"
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
								<Link to={pathTerms()} className="underline">
									Terms of Service
								</Link>
							</p>
						</CardContent>
					</Card>
				</div>
			</PageContent>
		</>
	)
}
