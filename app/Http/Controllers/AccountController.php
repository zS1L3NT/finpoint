<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Statement;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $accounts = Account::appQuery(
            query: request()->query('query')
        )
            ->paginate(request()->query('per_page') ?? 100)
            ->withQueryString();

        return Inertia::render('accounts', compact('accounts'));
    }

    public function show(Account $account)
    {
        $account->loadCount('statements');

        $statements = Statement::appQuery(
            query: request()->query('query'),
            account_id: $account->id,
        )
            ->paginate(request()->query('per_page') ?? 100)
            ->withQueryString();

        return Inertia::render('account', compact('account', 'statements'));
    }
}
