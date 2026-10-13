// Sparse, consistent x-axis ticks: day 1, every 5th day, and the last day.
export function dayTicks(length: number) {
	const ticks = [1]
	for (let day = 5; day < length - 2; day += 5) ticks.push(day)
	if (length > 1) ticks.push(length)
	return ticks
}
