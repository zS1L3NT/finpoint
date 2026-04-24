<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Record;
use App\Models\Recurrence;
use App\Models\Statement;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $today = Carbon::today();
        $monthStart = $today->copy()->startOfMonth();
        $monthEnd = $today->copy()->endOfMonth();
        $trendStart = $today->copy()->subMonths(5)->startOfMonth();
        $categoryPulseStart = $today->copy()->subDays(90)->startOfDay();

        $monthRecords = Record::query()
            ->whereBetween('datetime', [$monthStart->copy()->startOfDay(), $monthEnd->copy()->endOfDay()])
            ->get(['amount']);

        $incomeThisMonth = round($monthRecords->filter(fn ($record) => (float) $record->amount > 0)->sum(fn ($record) => (float) $record->amount), 2);
        $expensesThisMonth = round(abs($monthRecords->filter(fn ($record) => (float) $record->amount < 0)->sum(fn ($record) => (float) $record->amount)), 2);

        $trendRecords = Record::query()
            ->where('datetime', '>=', $trendStart->copy()->startOfDay())
            ->orderBy('datetime')
            ->get(['datetime', 'amount']);

        $recordsByMonth = $trendRecords->groupBy(fn ($record) => substr((string) $record->datetime, 0, 7));

        $monthlyTrend = collect(range(5, 0))->map(function ($monthsAgo) use ($recordsByMonth, $today) {
            $month = $today->copy()->subMonths($monthsAgo)->startOfMonth();
            $points = $recordsByMonth->get($month->format('Y-m')) ?? collect();
            $income = round($points->filter(fn ($record) => (float) $record->amount > 0)->sum(fn ($record) => (float) $record->amount), 2);
            $expenses = round(abs($points->filter(fn ($record) => (float) $record->amount < 0)->sum(fn ($record) => (float) $record->amount)), 2);

            return [
                'key' => $month->format('Y-m'),
                'label' => $month->format('M'),
                'month' => $month->format('F Y'),
                'income' => $income,
                'expenses' => $expenses,
                'net' => round($income - $expenses, 2),
                'recordCount' => $points->count(),
            ];
        })->values();

        $activeBudgetOverview = Budget::query()
            ->withSum('records', 'amount')
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->get();

        $budgetSpotlight = Budget::query()
            ->withSum('records', 'amount')
            ->withCount('records')
            ->orderByRaw(
                'case when start_date <= ? and end_date >= ? then 0 when start_date > ? then 1 else 2 end',
                [$today->format('Y-m-d'), $today->format('Y-m-d'), $today->format('Y-m-d')]
            )
            ->orderBy('end_date')
            ->orderBy('start_date')
            ->limit(6)
            ->get();

        $recurrenceOverview = Recurrence::query()
            ->withCount('records')
            ->orderBy('amount', 'desc')
            ->get();

        $pendingStatementsQuery = Statement::query()
            ->with('account')
            ->withSum('allocations', 'amount')
            ->where(fn ($query) => $query->whereNull('allocations_sum_amount')->orWhereColumn('allocations_sum_amount', '!=', 'statements.amount'));

        $pendingStatementSummary = (clone $pendingStatementsQuery)->get();

        $pendingStatements = (clone $pendingStatementsQuery)
            ->orderBy('date', 'desc')
            ->limit(6)
            ->get();

        $recentRecords = Record::query()
            ->with('category')
            ->orderBy('datetime', 'desc')
            ->limit(8)
            ->get();

        $categoryPulse = Record::query()
            ->with('category')
            ->where('datetime', '>=', $categoryPulseStart)
            ->orderBy('datetime', 'desc')
            ->get()
            ->filter(fn ($record) => $record->category !== null && (float) $record->amount < 0)
            ->groupBy('category_id')
            ->map(function ($records) {
                $first = $records->first();

                return [
                    'category' => $first->category,
                    'spent' => round(abs($records->sum(fn ($record) => (float) $record->amount)), 2),
                    'records_count' => $records->count(),
                ];
            })
            ->sortByDesc('spent')
            ->take(5)
            ->values();

        $summary = [
            'periodLabel' => $monthStart->format('F Y'),
            'netThisMonth' => round($incomeThisMonth - $expensesThisMonth, 2),
            'incomeThisMonth' => $incomeThisMonth,
            'expensesThisMonth' => $expensesThisMonth,
            'recordsThisMonth' => $monthRecords->count(),
            'totalRecords' => Record::query()->count(),
            'totalStatements' => Statement::query()->count(),
            'totalCategories' => Category::query()->count(),
            'pendingStatements' => $pendingStatementSummary->count(),
            'allocatorBacklog' => round($pendingStatementSummary->sum(fn ($statement) => abs((float) $statement->amount - (float) ($statement->allocations_sum_amount ?? 0))), 2),
            'activeBudgets' => $activeBudgetOverview->count(),
            'activeBudgetPlanned' => round($activeBudgetOverview->sum(fn ($budget) => (float) $budget->amount), 2),
            'activeBudgetSpent' => round(abs($activeBudgetOverview->sum(fn ($budget) => min((float) ($budget->records_sum_amount ?? 0), 0))), 2),
            'totalBudgets' => Budget::query()->count(),
            'monthlyRecurring' => round($recurrenceOverview->sum(fn ($recurrence) => $this->toMonthlyAmount((float) $recurrence->amount, $recurrence->period)), 2),
            'linkedRecurrenceRecords' => $recurrenceOverview->sum('records_count'),
            'totalRecurrences' => $recurrenceOverview->count(),
        ];

        return Inertia::render('dashboard', [
            'summary' => $summary,
            'monthlyTrend' => $monthlyTrend,
            'budgetSpotlight' => $budgetSpotlight,
            'recurrenceSpotlight' => $recurrenceOverview->take(6)->values(),
            'pendingStatements' => $pendingStatements,
            'recentRecords' => $recentRecords,
            'categoryPulse' => $categoryPulse,
        ]);
    }

    private function toMonthlyAmount(float $amount, string $period): float
    {
        return match ($period) {
            'year' => $amount / 12,
            default => $amount,
        };
    }
}
