<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Category;
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
        $budget->load('records', 'records.category');

        $categories = Category::query()
            ->with('children')
            ->whereNull('parent_category_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('budget', compact('budget', 'categories'));
    }
}
