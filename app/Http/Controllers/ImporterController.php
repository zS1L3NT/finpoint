<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Inertia\Inertia;

class ImporterController extends Controller
{
    public function index()
    {
        $accounts = Account::all();

        return Inertia::render('importer', compact('accounts'));
    }
}
