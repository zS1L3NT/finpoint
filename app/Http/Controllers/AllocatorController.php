<?php

namespace App\Http\Controllers;

use App\Models\Allocation;
use App\Models\Category;
use App\Models\Record;
use App\Models\Statement;
use Inertia\Inertia;

class AllocatorController extends Controller
{
    public function index()
    {
        $statements = Statement::query()
            ->with('account')
            ->addSelect([
                'allocations_sum_amount' => Allocation::query()
                    ->selectRaw('round(sum(amount), 2)')
                    ->whereColumn('source_statement_id', 'statements.id'),
            ])
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
            ->havingRaw('allocations_sum_amount is null or allocations_sum_amount != round(statements.amount, 2)')
            ->orderBy('datetime', 'desc')
            ->groupBy('statements.id')
            ->paginate(request('per_page') ?? 25)
            ->withQueryString();

        $categories = Category::query()
            ->with('children')
            ->whereNull('parent_category_id')
            ->orderBy('name')
            ->get();

        $titles = Record::query()
            ->distinct()
            ->whereNotNull('title')
            ->orderBy('title')
            ->pluck('title');

        $locations = Record::query()
            ->distinct()
            ->whereNotNull('location')
            ->orderBy('location')
            ->pluck('location');

        $peoples = Record::query()
            ->distinct()
            ->whereNotNull('people')
            ->orderBy('people')
            ->pluck('people');

        return Inertia::render('allocator', compact('statements', 'categories', 'titles', 'locations', 'peoples'));
    }
}
