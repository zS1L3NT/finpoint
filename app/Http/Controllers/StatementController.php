<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Statement;
use Inertia\Inertia;

class StatementController extends Controller
{
    public function index()
    {
        $statements = Statement::query()
            ->with("account")
            ->withSum("allocations", "amount")
            ->whereNull("allocations_sum_amount")
            ->orWhereColumn("allocations_sum_amount", "!=", "statements.amount")
            ->orderBy("date", "desc")
            ->paginate(100);

        $categories = Category::orderBy("name")->get();

        return Inertia::render("statements/index", compact("statements", "categories"));
    }
}
