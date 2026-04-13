<?php

namespace App\Http\Controllers;

use App\Models\Statement;
use Inertia\Inertia;

class StatementController extends Controller
{
    public function index()
    {
        $statements = Statement::with("account")->orderBy("transaction_date", "desc")->paginate(100);
        return Inertia::render("Statements/Index", compact("statements"));
    }
}
