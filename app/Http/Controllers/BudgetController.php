<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Inertia\Inertia;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Budget::query()
            ->orderBy("start_date", "desc")
            ->paginate(100);

        return Inertia::render("budgets/index", compact("budgets"));
    }

    public function show(Budget $budget)
    {
        $budget->loadSum("records", "amount");
        $budget->load("records", "records.category");

        return Inertia::render("budgets/show", compact("budget"));
    }
}
