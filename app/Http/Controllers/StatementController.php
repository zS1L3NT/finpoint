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
            ->when(request()->query("query"), fn($query, $q) => $query->where("description", "like", "%" . $q . "%"))
            ->orderBy("date", "desc")
            ->paginate(request("per_page") ?? 25)
            ->withQueryString();

        return Inertia::render("statements", compact("statements"));
    }

    public function show(Statement $statement)
    {
        $statement->load("account", "records", "records.category");

        return Inertia::render("statement", compact("statement"));
    }
}
