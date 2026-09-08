<?php

namespace App\Http\Controllers;

use App\Models\Bucket;
use App\Models\Record;
use App\Support\RecordAnalytics;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(RecordAnalytics $analytics)
    {
        $date = $this->requestedMonth();
        $today = now()->startOfDay();
        $isCurrent = $date->isSameMonth($today);
        $isFuture = $date->clone()->startOfMonth()->gt($today->clone()->startOfMonth());
        $actualEnd = $isCurrent ? $today->clone()->endOfDay() : $date->clone()->endOfMonth();

        $allRecords = Record::query()
            ->with(['category.parent', 'bucket'])
            ->whereBetween('datetime', [$date->clone()->startOfMonth(), $date->clone()->endOfMonth()])
            ->get();

        $actualRecords = $isFuture
            ? collect()
            : $allRecords->filter(fn ($record) => $record->datetime->lte($actualEnd))->values();
        $futureRecords = $allRecords->diff($actualRecords)->values();
        $summary = $analytics->summarize($actualRecords);
        $futureSummary = $analytics->summarize($futureRecords);

        $comparisonMonths = collect(range(1, 3))->map(function ($offset) use ($date, $isCurrent, $today, $analytics) {
            $month = $date->clone()->subMonthsNoOverflow($offset)->startOfMonth();
            $coverage = DB::table('analytics_months')->where('month', $month->toDateString())->first();
            $endDay = $isCurrent ? min($today->day, $month->daysInMonth) : $month->daysInMonth;
            $records = Record::query()
                ->with(['category.parent', 'bucket'])
                ->whereBetween('datetime', [$month, $month->clone()->day($endDay)->endOfDay()])
                ->get();
            $excluded = (bool) ($coverage?->excluded_from_comparisons ?? false)
                || ($coverage?->coverage ?? null) === 'incomplete'
                || ($records->isEmpty() && ($coverage?->coverage ?? 'unknown') !== 'complete');

            return [
                'month' => $month->format('M Y'),
                'included' => ! $excluded,
                'reason' => match (true) {
                    (bool) ($coverage?->excluded_from_comparisons ?? false) => 'Excluded manually',
                    ($coverage?->coverage ?? null) === 'incomplete' => 'Marked incomplete',
                    $records->isEmpty() && ($coverage?->coverage ?? 'unknown') !== 'complete' => 'No recorded activity; coverage unknown',
                    default => ($coverage?->coverage ?? 'unknown') === 'complete'
                        ? 'Complete'
                        : 'Recorded history; coverage unconfirmed',
                },
                'summary' => $analytics->summarize($records),
            ];
        });

        $included = $comparisonMonths->where('included', true)->values();
        $comparison = $this->comparison($summary, $included);
        $buckets = $this->buckets($date, $summary, $included);
        $projection = $this->projection(
            $date,
            $summary,
            $futureSummary,
            $buckets,
            $isCurrent,
            $isFuture,
            $actualEnd->day,
        );

        return Inertia::render('dashboard', [
            'month' => $date->monthName,
            'year' => $date->year,
            'period' => [
                'is_current' => $isCurrent,
                'is_future' => $isFuture,
                'through' => $isCurrent ? $today->toDateString() : null,
                'label' => $isCurrent ? 'Through '.$today->format('j M') : ($isFuture ? 'Future month' : 'Full month'),
            ],
            'summary' => $summary,
            'comparison' => $comparison,
            'series' => $this->series(
                $summary,
                $futureSummary,
                $included,
                $date->daysInMonth,
                $actualEnd->day,
                $projection['daily_spending'],
            ),
            'projection' => $projection,
            'buckets' => $buckets,
            'categories' => $this->categories($summary, $included),
            'future_records_count' => $futureRecords->count(),
        ]);
    }

    private function requestedMonth(): Carbon
    {
        $month = request()->string('month', now()->monthName)->toString();
        $year = request()->integer('year', now()->year);

        try {
            $date = Carbon::createFromFormat('!F Y', $month.' '.$year);
        } catch (\Throwable) {
            abort(404);
        }

        abort_unless($date && $date->monthName === $month && $year >= 2000 && $year <= 2100, 404);

        return $date->startOfMonth();
    }

    private function comparison(array $summary, $included): array
    {
        $result = ['count' => $included->count()];

        foreach (['income', 'spending', 'surplus', 'surplus_rate'] as $field) {
            $values = $included->pluck('summary.'.$field)->filter(fn ($value) => $value !== null);
            $average = $values->isEmpty() ? null : $values->average();
            $result[$field] = [
                'average' => $average,
                'difference' => $average === null ? null : $summary[$field] - $average,
            ];
        }

        if ($included->isNotEmpty()) {
            $meanIncome = $included->avg('summary.income');
            $meanSpending = $included->avg('summary.spending');
            $result['surplus_rate']['average'] = $meanIncome > 0
                ? ($meanIncome - $meanSpending) / $meanIncome * 100
                : null;
            $result['surplus_rate']['difference'] = $summary['surplus_rate'] !== null
                && $result['surplus_rate']['average'] !== null
                    ? $summary['surplus_rate'] - $result['surplus_rate']['average']
                    : null;
        }

        return $result;
    }

    private function series(
        array $summary,
        array $futureSummary,
        $included,
        int $days,
        int $actualDays,
        ?float $projectedDailySpending,
    ): array {
        $income = 0;
        $spending = 0;
        $comparisonCumulative = array_fill(1, $days, 0.0);

        foreach ($included as $month) {
            $monthTotal = 0;
            foreach (range(1, $days) as $day) {
                $entry = collect($month['summary']['daily'])->first(fn ($item) => (int) substr($item['date'], -2) === $day);
                $monthTotal += $entry['spending'] ?? 0;
                $comparisonCumulative[$day] += $monthTotal;
            }
        }

        $projectedSpending = $summary['spending'];

        return collect(range(1, $days))->map(function ($day) use (&$income, &$spending, &$projectedSpending, $summary, $futureSummary, $included, $comparisonCumulative, $actualDays, $projectedDailySpending) {
            $isActual = $day <= $actualDays;
            if ($isActual) {
                $entry = collect($summary['daily'])->first(fn ($item) => (int) substr($item['date'], -2) === $day);
                $income += $entry['income'] ?? 0;
                $spending += $entry['spending'] ?? 0;
            }
            if (! $isActual && $projectedDailySpending !== null) {
                $entry = collect($futureSummary['daily'])->first(fn ($item) => (int) substr($item['date'], -2) === $day);
                $projectedSpending += $projectedDailySpending + ($entry['spending'] ?? 0);
            }

            return [
                'day' => $day,
                'income' => $isActual ? round($income, 2) : null,
                'spending' => $isActual ? round($spending, 2) : null,
                'projected_spending' => $projectedDailySpending !== null && $day >= $actualDays
                    ? round($projectedSpending, 2)
                    : null,
                'surplus' => $isActual ? round($income - $spending, 2) : null,
                'average_spending' => $included->isEmpty() || ! $isActual
                    ? null
                    : round($comparisonCumulative[$day] / $included->count(), 2),
            ];
        })->all();
    }

    private function projection(
        Carbon $date,
        array $summary,
        array $futureSummary,
        array $buckets,
        bool $isCurrent,
        bool $isFuture,
        int $elapsedDays,
    ): array {
        if (! $isCurrent || $isFuture || $elapsedDays < 1) {
            return [
                'available' => false,
                'daily_spending' => null,
                'projected_spending' => null,
                'scheduled_spending' => 0,
                'remaining_days' => 0,
                'bucket' => null,
            ];
        }

        $remainingDays = max($date->daysInMonth - $elapsedDays, 0);
        $dailySpending = $summary['gross_spending'] / $elapsedDays;
        $paceBucket = collect($buckets)->first(
            fn ($bucket) => $bucket['pace_kind'] === 'daily'
                && $bucket['target'] !== null
                && $bucket['target'] > 0
        );
        $futureBuckets = collect($futureSummary['buckets'])->keyBy('id');
        $scheduledBucketSpending = $paceBucket
            ? (float) ($futureBuckets->get($paceBucket['id'])['spending'] ?? 0)
            : 0;

        return [
            'available' => true,
            'daily_spending' => round($dailySpending, 2),
            'projected_spending' => round($summary['spending'] + $futureSummary['spending'] + $dailySpending * $remainingDays, 2),
            'scheduled_spending' => round($futureSummary['spending'], 2),
            'remaining_days' => $remainingDays,
            'bucket' => $paceBucket ? [
                'name' => $paceBucket['name'],
                'spent' => $paceBucket['spending'],
                'target' => $paceBucket['target'],
                'projected' => round(
                    $paceBucket['spending'] + $scheduledBucketSpending + ($paceBucket['spending'] / $elapsedDays) * $remainingDays,
                    2
                ),
                'usage_pace' => round($paceBucket['spending'] / $elapsedDays, 2),
                'target_pace' => round($paceBucket['target'] / $date->daysInMonth, 2),
                'recommended_pace' => $remainingDays
                    ? round(max(($paceBucket['target'] - $paceBucket['spending'] - $scheduledBucketSpending) / $remainingDays, 0), 2)
                    : null,
            ] : null,
        ];
    }

    private function buckets(Carbon $date, array $summary, $included): array
    {
        $current = collect($summary['buckets'])->keyBy('id');
        $baseline = $included->flatMap(fn ($month) => $month['summary']['buckets'])
            ->groupBy('id')
            ->map(fn ($items) => $items->sum('spending') / max($included->count(), 1));

        return Bucket::query()->where('archived', false)->orderBy('display_order')->get()->map(function ($bucket) use ($date, $current, $baseline) {
            $override = DB::table('bucket_targets')
                ->where('bucket_id', $bucket->id)
                ->where('month', $date->toDateString())
                ->first();
            $target = $override
                ? $override->amount
                : DB::table('bucket_defaults')
                    ->where('bucket_id', $bucket->id)
                    ->where('effective_month', '<=', $date->toDateString())
                    ->orderByDesc('effective_month')
                    ->value('amount');
            $spending = (float) ($current->get($bucket->id)['spending'] ?? 0);

            return [
                ...$bucket->toArray(),
                'spending' => $spending,
                'target' => $target === null ? null : (float) $target,
                'remaining' => $target === null ? null : (float) $target - $spending,
                'comparison' => $baseline->has($bucket->id) ? $spending - $baseline[$bucket->id] : null,
            ];
        })->all();
    }

    private function categories(array $summary, $included): array
    {
        $current = collect($summary['categories'])->keyBy('id');
        $baselineCategories = $included->flatMap(fn ($month) => $month['summary']['categories'])
            ->groupBy('id');
        $baseline = $baselineCategories
            ->map(fn ($items) => $items->sum('spending') / max($included->count(), 1));

        $baselineBuckets = $baselineCategories
            ->map(function ($items) use ($included) {
                return $items->flatMap(fn ($item) => array_keys($item['bucket_spending']))
                    ->unique()
                    ->mapWithKeys(fn ($bucketId) => [
                        $bucketId => $items->sum(fn ($item) => $item['bucket_spending'][$bucketId] ?? 0) / max($included->count(), 1),
                    ]);
            });

        return $current->keys()->merge($baselineCategories->keys())->unique()->map(function ($categoryId) use ($current, $baselineCategories, $baseline, $baselineBuckets, $summary) {
            $category = $current->get($categoryId);
            if (! $category) {
                $sample = $baselineCategories->get($categoryId)->first();
                $category = [
                    ...collect($sample)->only(['id', 'name', 'icon', 'color'])->all(),
                    'spending' => 0,
                    'records' => 0,
                    'bucket_spending' => [],
                ];
            }

            return [
                ...$category,
                'share' => $summary['spending'] > 0 && $category['spending'] >= 0
                    ? $category['spending'] / $summary['spending'] * 100
                    : null,
                'comparison' => $baseline->has($category['id'])
                    ? $category['spending'] - $baseline[$category['id']]
                    : null,
                'baseline_bucket_spending' => $baselineBuckets->get($category['id'], collect())->all(),
            ];
        })->values()->all();
    }
}
