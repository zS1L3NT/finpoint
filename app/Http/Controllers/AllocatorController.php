<?php

namespace App\Http\Controllers;

use App\Models\Statement;
use Inertia\Inertia;

class AllocatorController extends Controller
{
    public function index()
    {
        $statements = Statement::query()
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
            ->when(
                request()->query('start_date'),
                fn($query, $date) => $query->whereDate('datetime', '>=', $date)
            )
            ->when(
                request()->query('end_date'),
                fn($query, $date) => $query->whereDate('datetime', '<=', $date)
            )
            ->havingRaw('allocable_amount != 0')
            ->orderBy('datetime', 'desc')
            ->groupBy('statements.id')
            ->paginate(request('per_page') ?? 100)
            ->withQueryString();

        return Inertia::render('allocator', compact('statements'));
    }
}
