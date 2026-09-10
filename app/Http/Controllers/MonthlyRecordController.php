<?php

namespace App\Http\Controllers;

use App\Models\Bucket;
use App\Models\Category;
use App\Models\Record;
use App\Support\RecordAnalytics;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class MonthlyRecordController extends Controller
{
    public function __invoke(RecordAnalytics $analytics)
    {
        $month = request()->string('month', now()->monthName)->toString();
        $year = request()->integer('year', now()->year);

        try {
            $date = Carbon::createFromFormat('!F Y', $month.' '.$year)->startOfMonth();
        } catch (\Throwable) {
            abort(404);
        }
        abort_unless($date->monthName === $month && $year >= 2000 && $year <= 2100, 404);

        $today = now()->startOfDay();
        $isCurrent = $date->isSameMonth($today);
        $isFuture = $date->gt($today->clone()->startOfMonth());
        $actualEnd = $isCurrent ? $today->toDateString() : $date->clone()->endOfMonth()->toDateString();

        $categoryIds = request()->string('category_ids')->explode(',')->filter();
        $categoryIds = $categoryIds->merge(
            Category::query()->whereIn('parent_category_id', $categoryIds)->pluck('id')
        )->unique()->all();

        $records = Record::appQuery(
            start_date: $date->toDateString(),
            end_date: $date->clone()->endOfMonth()->toDateString(),
            is_allocated: request()->query('is_allocated'),
            category_ids: $categoryIds,
            bucket_id: request()->query('bucket_id'),
            bucket_group: request()->query('bucket_group'),
            show_unbucketed: request()->boolean('show_unbucketed'),
            treatment: request()->query('treatment'),
        )->with(['category.parent', 'bucket'])->get();

        if ($day = request()->integer('day')) {
            abort_unless($day >= 1 && $day <= $date->daysInMonth, 422);
            $records = $records->filter(fn ($record) => $record->datetime->day === $day)->values();
        }

        $actualRecords = $isFuture
            ? collect()
            : $records->filter(fn ($record) => $record->datetime->toDateString() <= $actualEnd)->values();
        $futureRecords = $records->diff($actualRecords)->values();

        return Inertia::render('monthly-records', [
            'month' => $month,
            'year' => $year,
            'period' => [
                'is_current' => $isCurrent,
                'is_future' => $isFuture,
                'through' => $isCurrent ? $today->toDateString() : null,
            ],
            'records' => $actualRecords,
            'future_records' => $futureRecords,
            'summary' => $analytics->summarize($actualRecords),
            'buckets' => Bucket::query()->where('archived', false)->orderBy('display_order')->get(),
            'filters' => request()->only([
                'category_ids', 'is_allocated', 'bucket_id', 'bucket_group', 'show_unbucketed',
                'treatment', 'day',
            ]),
        ]);
    }
}
