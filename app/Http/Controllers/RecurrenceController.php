<?php

namespace App\Http\Controllers;

use App\Models\Recurrence;
use Inertia\Inertia;

class RecurrenceController extends Controller
{
    public function index()
    {
        $query = Recurrence::query()
            ->when(
                request()->query('query'),
                fn($query, $q) => $query
                    ->where(
                        fn($query) => $query
                            ->where('name', 'like', '%' . $q . '%')
                            ->orWhere('amount', 'like', '%' . $q . '%')
                    )
            );

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
