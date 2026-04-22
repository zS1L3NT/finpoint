import { router } from "@inertiajs/react"
import { useState } from "react"
import AppHeader from "@/components/app-header"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { allocatorWebRoute, importerApiRoute } from "@/wayfinder/routes"

export default function Importer() {
	const [errors, setErrors] = useState<{ [key: string]: string[] }>({})

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		await fetch(store.url(), {
			method: "POST",
			body: new FormData(e.currentTarget),
			headers: { Accept: "application/json" },
		})
			.then(async res => [res, await res.json()] as const)
			.then(([res, data]) => {
				if (res.status === 422) {
					setErrors(data.errors)
				}

				if (res.status === 200) {
					router.visit(allocatorWebRoute.url())
				}
			})
	}

	const filesErrors = Object.entries(errors)
		.filter(([k, v]) => k.startsWith("files"))
		.toSorted(([a], [b]) => a.localeCompare(b))
		.flatMap(([k, v]) => v)

	return (
		<>
			<AppHeader title="Importer" />

			<PageHeader
				title="Importer"
				subtitle="Upload one or more bank CSV exports, create any missing accounts, and move straight into allocation once the feed is loaded."
				description="Import workspace"
				icon={ImportIcon}
				actions={
					<Button size="lg" variant="outline" asChild>
						<Link href={allocatorWebRoute.url()}>
							<LinkIcon /> Open allocator
						</Link>
					</Button>
				}
			/>

			<form
				method="POST"
				// action={importMethod.url()}
				encType="mutlipart/form-data"
				className="flex items-center justify-center min-h-full"
				onSubmit={handleSubmit}
			>
				<Card className="min-w-md">
					<CardHeader>
						<CardTitle>Importer</CardTitle>
						<CardDescription>Import bank statements from CSV files</CardDescription>
					</CardHeader>
					<CardContent>
						<Field data-invalid={!!filesErrors.length}>
							<FieldLabel htmlFor="files[]">Files</FieldLabel>
							<Input
								id="files[]"
								name="files[]"
								type="file"
								multiple
								required
								aria-invalid={!!filesErrors.length}
							/>
							<FieldError>{filesErrors[0]}</FieldError>
						</Field>
					</CardContent>
					<CardFooter className="flex-col gap-2">
						<Button type="submit" className="w-full">
							Import
						</Button>
					</CardFooter>
				</Card>
			</form>
		</>
	)
}
