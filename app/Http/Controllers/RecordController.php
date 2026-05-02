<?php

namespace App\Http\Controllers;

use App\Models\Allocation;
use App\Models\Category;
use App\Models\Record;
use Inertia\Inertia;

class RecordController extends Controller
{
    public function index()
    {
        $records = Record::query()
            ->with('category')
            ->when(
                request()->query('query'),
                fn($query, $q) => $query
                    ->select('records.*')
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
            ->orderBy('datetime', 'desc')
            ->groupBy('records.id')
            ->paginate(request('per_page') ?? 25)
            ->withQueryString();

        return Inertia::render('records', compact('records'));
    }

    public function show(Record $record)
    {
        $record->load([
            'category',
            'statements' => fn($query) => $query
                ->with('account')
                ->addSelect([
                    'allocations_sum_amount' => Allocation::query()
                        ->selectRaw('round(sum(amount), 2)')
                        ->whereColumn('source_statement_id', 'statements.id'),
                ])
        ]);

        $categories = Category::query()
            ->with('children')
            ->whereNull('parent_category_id')
            ->orderBy('name')
            ->get();

        $titles = Record::query()
            ->distinct()
            ->whereNotNull('title')
            ->orderBy('title')
            ->pluck('title');

        $locations = Record::query()
            ->distinct()
            ->whereNotNull('location')
            ->orderBy('location')
            ->pluck('location');

        $peoples = Record::query()
            ->distinct()
            ->whereNotNull('people')
            ->orderBy('people')
            ->pluck('people');

        return Inertia::render('record', compact('record', 'categories', 'titles', 'locations', 'peoples'));
    }
}
