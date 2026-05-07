<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Inertia\Inertia;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Budget::appQuery(
            query: request()->query('query')
        )
            ->paginate(request()->query('per_page') ?? 100)
            ->withQueryString();

        return Inertia::render('budgets', compact('budgets'));
    }

    public function show(Budget $budget)
    {
        $records = $budget->records;

        return Inertia::render('budget', compact('budget', 'records'));
    }
}
