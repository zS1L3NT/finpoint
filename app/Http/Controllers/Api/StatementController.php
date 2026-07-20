<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Statement;

class StatementController extends Controller
{
    public function index()
    {
        return Statement::appQuery(
            query: request()->query('query'),
            exclude_ids: request()->query('exclude_ids'),
            start_date: request()->query('start_date'),
            is_allocable: request()->query('is_allocable')
        )->get();
    }
}
