<?php

namespace App\Http\Controllers;

use App\Models\Statement;
use Inertia\Inertia;

class StatementController extends Controller
{
    public function index()
    {
        $statements = Statement::query()
            ->with("account")
            ->orderBy("date", "desc")
            ->paginate(100);

        return Inertia::render("statements/index", compact("statements"));
    }

    public function show(Statement $statement)
    {
        $statement->load("account", "records", "records.category");

        return Inertia::render("statements/show", compact("statement"));
    }
}
