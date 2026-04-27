<?php

namespace App\Http\Controllers;

use App\Models\Recurrence;
use Inertia\Inertia;

class RecurrenceController extends Controller
{
    public function index()
    {
        $query = Recurrence::query()
            ->when(request()->query('query'), fn($query, $term) => $query->where('name', 'like', '%' . $term . '%'));

        $breakdown = (clone $query)
            ->withCount('records')
            ->orderBy('amount', 'desc')
            ->get();

        $recurrences = $query
            ->withCount('records')
            ->orderBy('amount', 'desc')
            ->groupBy('recurrences.id')
            ->paginate(request('per_page') ?? 25)
            ->withQueryString();

        return Inertia::render('recurrences', compact('recurrences', 'breakdown'));
    }

    public function show(Recurrence $recurrence)
    {
        $recurrence->loadCount('records');
        $recurrence->load('records', 'records.category');

        return Inertia::render('recurrence', compact('recurrence'));
    }
}
