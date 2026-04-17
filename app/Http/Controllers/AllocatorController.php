<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Statement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AllocatorController extends Controller
{
    public function index()
    {
        $statements = Statement::query()
            ->with("account")
            ->withSum("allocations", "amount")
            ->when(request()->query("query"), fn($query, $q) => $query->where("description", "like", "%" . $q . "%"))
            ->where(fn($query) => $query->whereNull("allocations_sum_amount")->orWhereColumn("allocations_sum_amount", "!=", "statements.amount"))
            ->orderBy("date", "desc")
            ->paginate(100);

        $categories = Category::query()
            ->with("children")
            ->whereNull("parent_category_id")
            ->orderBy("name")
            ->get();

        return Inertia::render("allocator", compact("statements", "categories"));
    }
}
