<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Statement;
use Inertia\Inertia;

class StatementController extends Controller
{
    public function index()
    {
        $statements = Statement::appQuery(
            query: request()->query('query'),
            is_pending: request()->query('is_pending'),
        )
            ->paginate(request()->query('per_page') ?? 100)
            ->withQueryString();
        $accounts = Account::appQuery()->get();

        return Inertia::render('statements', compact('statements', 'accounts'));
    }

    public function show(Statement $statement)
    {
        $records = $statement->records;
        $accounts = Account::appQuery()->get();

        return Inertia::render('statement', compact('statement', 'records', 'accounts'));
    }
}
