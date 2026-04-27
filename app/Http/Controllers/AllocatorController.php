<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Statement;
use Inertia\Inertia;

class AllocatorController extends Controller
{
    public function index()
    {
        $statements = Statement::query()
            ->with('account')
            ->withSum('allocations', 'amount')
            ->when(
                request()->query('query'),
                fn($query, $q) => $query
                    ->leftJoin('accounts', 'statements.account_id', '=', 'accounts.id')
                    ->where(
                        fn($query) => $query
                            // ->where('datetime', '=', Carbon::parse($q))
                            ->where('amount', 'like', '%' . $q . '%')
                            ->orWhere('description', 'like', '%' . $q . '%')
                            ->orWhere('accounts.id', 'like', '%' . $q . '%')
                    )
            )
            ->where(
                fn($query) => $query
                    ->whereNull('allocations_sum_amount')
                    ->orWhereColumn('allocations_sum_amount', '!=', 'statements.amount')
            )
            ->orderBy('date', 'desc')
            ->groupBy('statements.id')
            ->paginate(request('per_page') ?? 25)
            ->withQueryString();

        $categories = Category::query()
            ->with('children')
            ->whereNull('parent_category_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('allocator', compact('statements', 'categories'));
    }
}
