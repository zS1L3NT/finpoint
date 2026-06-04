<?php

namespace App\Http\Controllers;

use App\Models\Statement;
use Inertia\Inertia;

class AllocatorController extends Controller
{
    public function index()
    {
        $statements = Statement::appQuery(
            query: request()->query('query'),
            start_date: request()->query('start_date'),
            end_date: request()->query('end_date'),
            is_allocable: 'true'
        )
            ->paginate(request()->query('per_page') ?? 100)
            ->withQueryString();

        return Inertia::render('allocator', compact('statements'));
    }
}
