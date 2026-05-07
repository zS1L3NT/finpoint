<?php

namespace App\Http\Controllers;

use App\Models\Record;
use Inertia\Inertia;

class RecordController extends Controller
{
    public function index()
    {
        $records = Record::query()
            ->when(
                request()->query('query'),
                fn($query, $q) => $query
                    ->leftJoin('categories', 'records.category_id', '=', 'categories.id')
                    ->where(
                        fn($query) => $query
                            ->where('title', 'like', '%' . $q . '%')
                            ->orWhere('people', 'like', '%' . $q . '%')
                            ->orWhere('location', 'like', '%' . $q . '%')
                            ->orWhere('description', 'like', '%' . $q . '%')
                            // ->orWhere('datetime', '=', Carbon::parse($q))
                            ->orWhere('amount', 'like', '%' . $q . '%')
                            ->orWhere('categories.name', 'like', '%' . $q . '%')
                    )
            )
            ->when(
                request()->query('start_date'),
                fn($query, $date) => $query->whereDate('datetime', '>=', $date)
            )
            ->when(
                request()->query('end_date'),
                fn($query, $date) => $query->whereDate('datetime', '<=', $date)
            )
            ->when(
                collect(['true', 'false'])->contains(request()->query('is_allocated')),
                fn($query) => $query->havingRaw(request()->query('is_allocated') === 'true' ? 'allocated_amount = amount' : 'allocated_amount != amount')
            )
            ->orderBy('datetime', 'desc')
            ->groupBy('records.id')
            ->paginate(request('per_page') ?? 100)
            ->withQueryString();

        return Inertia::render('records', compact('records'));
    }

    public function show(Record $record)
    {
        $statements = $record->statements;

        return Inertia::render('record', compact('record', 'statements'));
    }
}
