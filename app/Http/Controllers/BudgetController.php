<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Record;
use Inertia\Inertia;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Budget::query()
            ->when(
                request()->query('query'),
                fn($query, $q) => $query
                    ->where(
                        fn($query) => $query
                            ->where('name', 'like', '%' . $q . '%')
                            ->orWhere('amount', 'like', '%' . $q . '%')
                    )
            )
            ->withSum('records', 'amount')
            ->orderBy('end_date', 'desc')
            ->groupBy('budgets.id')
            ->paginate(request('per_page') ?? 25)
            ->withQueryString();

        return Inertia::render('budgets', compact('budgets'));
    }

    public function show(Budget $budget)
    {
        $included_records = $budget
            ->records()
            ->with('category')
            ->get()
            ->map(fn(Record $r) => [...$r->toArray(), 'excluded' => false]);

        $excluded_records = Record::query()
            ->with('category')
            ->where('datetime', '>=', $budget->start_date)
            ->where('datetime', '<=', $budget->end_date)
            ->whereDoesntHave('budgets', fn($query) => $query->where('budgets.id', $budget->id))
            ->get()
            ->map(fn(Record $r) => [...$r->toArray(), 'excluded' => true]);

        $records = $included_records
            ->concat($excluded_records)
            ->sortBy([
                ['datetime', 'desc'],
                ['title', 'asc']
            ])
            ->values();

        $categories = Category::query()
            ->with('children')
            ->whereNull('parent_category_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('budget', compact('budget', 'records', 'categories'));
    }
}
