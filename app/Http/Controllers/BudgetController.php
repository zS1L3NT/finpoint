<?php

namespace App\Http\Controllers;

use App\Models\Budget;
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
            ->paginate(request('per_page') ?? 100)
            ->withQueryString();

        return Inertia::render('budgets', compact('budgets'));
    }

    public function show(Budget $budget)
    {
        $budget->load('records');

        return Inertia::render('budget', compact('budget'));
    }
}
