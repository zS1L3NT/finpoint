<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Inertia\Inertia;

class BudgetController extends Controller
{
    public function index()
    {
        $query = Budget::query()
            ->when(request()->query('query'), fn($query, $term) => $query->where('name', 'like', '%' . $term . '%'));

        $overview = (clone $query)
            ->withSum('records', 'amount')
            ->withCount('records')
            ->orderBy('start_date', 'desc')
            ->get();

        $budgets = $query
            ->withSum('records', 'amount')
            ->withCount('records')
            ->orderBy('start_date', 'desc')
            ->paginate(request('per_page') ?? 25)
            ->withQueryString();

        return Inertia::render('budgets', compact('budgets', 'overview'));
    }

    public function show(Budget $budget)
    {
        $budget->loadSum('records', 'amount');
        $budget->loadCount('records');
        $budget->load('records', 'records.category');

        return Inertia::render('budget', compact('budget'));
    }
}
