<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Record;
use Inertia\Inertia;

class RecordController extends Controller
{
    public function index()
    {
        $records = Record::query()
            ->with('category')
            ->withCount('statements')
            ->when(
                request()->query('query'),
                fn($query, $q) => $query
                    ->select('records.*')
                    ->leftJoin('categories', 'records.category_id', '=', 'categories.id')
                    ->where('title', 'like', '%' . $q . '%')
                    ->orWhere('people', 'like', '%' . $q . '%')
                    ->orWhere('location', 'like', '%' . $q . '%')
                    ->orWhere('description', 'like', '%' . $q . '%')
                    // ->orWhere('datetime', '=', Carbon::parse($q))
                    ->orWhere('amount', 'like', '%' . $q . '%')
                    ->orWhere('categories.name', 'like', '%' . $q . '%')
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
            'statements' => fn($query) => $query->with('account')->withSum('allocations', 'amount')
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
