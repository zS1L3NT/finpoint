<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Inertia\Inertia;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Budget::query()
            ->when(request()->query('query'), fn($query, $term) => $query->where('name', 'like', '%' . $term . '%'))
            ->withSum('records', 'amount')
            ->orderBy('end_date', 'desc')
            ->groupBy('budgets.id')
            ->paginate(request('per_page') ?? 25)
            ->withQueryString();

        return Inertia::render('budgets', compact('budgets'));
    }

    public function show(Budget $budget)
    {
        $budget->loadSum('records', 'amount');
        $budget->loadCount('records');
        $budget->load('records', 'records.category');

        return Inertia::render('budget', compact('budget'));
    }
}
