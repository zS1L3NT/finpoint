<?php

namespace App\Http\Controllers;

use App\Models\Statement;

class StatementController extends Controller
{
    public function index()
    {
        $statements = Statement::with("account")->orderBy("transaction_date", "desc")->paginate(100);
        return view("statements.index", compact("statements"));
    }
}
