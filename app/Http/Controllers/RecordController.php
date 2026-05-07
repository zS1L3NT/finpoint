<?php

namespace App\Http\Controllers;

use App\Models\Record;
use Inertia\Inertia;

class RecordController extends Controller
{
    public function index()
    {
        $records = Record::appQuery(
            query: request()->query('query'),
            start_date: request()->query('start_date'),
            end_date: request()->query('end_date'),
            is_allocated: request()->query('is_allocated'),
        )
            ->paginate(request()->query('per_page') ?? 100)
            ->withQueryString();

        return Inertia::render('records', compact('records'));
    }

    public function show(Record $record)
    {
        $statements = $record->statements;

        return Inertia::render('record', compact('record', 'statements'));
    }
}
