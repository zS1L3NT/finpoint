<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Statement;

class StatementController extends Controller
{
    public function index()
    {
        return Statement::query()
            ->when(
                request()->query('query'),
                fn($query, $q) => $query
                    ->leftJoin('accounts', 'statements.account_id', '=', 'accounts.id')
                    ->where(
                        fn($query) => $query
                            ->where('description', 'like', '%' . $q . '%')
                            ->orWhere('amount', 'like', '%' . $q . '%')
                            ->orWhere('accounts.id', 'like', '%' . $q . '%')
                    )
            )
            ->when(
                request()->query('exclude_ids'),
                fn($query, $ids) => $query->whereNotIn('statements.id', explode(',', $ids))
            )
            ->havingRaw('allocable_amount is null or allocable_amount != 0')
            ->orderBy('datetime', 'desc')
            ->groupBy('statements.id')
            ->get();
    }
}
