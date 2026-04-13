<?php

namespace App\Http\Controllers;

class StatementController extends Controller
{
    public function index()
    {
        return view("statements.index");
    }
}
