<?php

namespace App\Http\Controllers;

use App\Models\Statement;
use Inertia\Inertia;

class StatementController extends Controller
{
    public function index()
    {
        $statements = Statement::query()
            ->with('account')
            ->when(
                request()->query('query'),
                fn($query, $q) => $query
                    ->leftJoin('accounts', 'accounts.id', '=', 'statements.account_id')
                    ->where('description', 'like', '%' . $q . '%')
                    ->orWhere('amount', 'like', '%' . $q . '%')
                    ->orWhere('accounts.id', 'like', '%' . $q . '%')
            )
            ->orderBy('datetime', 'desc')
            ->groupBy('statements.id')
            ->paginate(request('per_page') ?? 25)
            ->withQueryString();

        return Inertia::render('statements', compact('statements'));
    }

    public function show(Statement $statement)
    {
        $statement->load('account', 'records', 'records.category');

        return Inertia::render('statement', compact('statement'));
    }
}
