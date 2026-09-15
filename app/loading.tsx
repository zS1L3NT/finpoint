export default function Loading() {
	return (
		<div className="flex min-h-screen font-sans">
			<div className="hidden w-72 shrink-0 border-r p-4 max-md:hidden" />
			<div className="flex min-w-0 flex-1 flex-col gap-7 p-8">
				<div className="grid gap-2.5">
					<div className="h-3 w-32 animate-pulse rounded-md bg-muted" />
					<div className="h-9 w-64 animate-pulse rounded-md bg-muted" />
					<div className="h-3.5 w-50 animate-pulse rounded-md bg-muted" />
				</div>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					{Array.from({ length: 4 }).map((_, index) => (
						<div key={index} className="grid gap-2.5 rounded-lg border p-4">
							<div className="h-3 w-3/5 animate-pulse rounded-md bg-muted" />
							<div className="h-7 w-4/5 animate-pulse rounded-md bg-muted" />
						</div>
					))}
				</div>
				<div className="h-70 animate-pulse rounded-md bg-muted" />
			</div>
		</div>
	)
}
