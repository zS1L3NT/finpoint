<?php

namespace App\Http\Controllers;

use App\Models\Statement;
use Inertia\Inertia;

class StatementController extends Controller
{
    public function index()
    {
        $statements = Statement::appQuery(
            query: request()->query('query'),
        )
            ->paginate(request()->query('per_page') ?? 100)
            ->withQueryString();

        return Inertia::render('statements', compact('statements'));
    }

    public function show(Statement $statement)
    {
        $records = $statement->records;

        return Inertia::render('statement', compact('statement', 'records'));
    }
}
