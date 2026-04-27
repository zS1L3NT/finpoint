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
            ->when(request()->query('query'), fn($query, $q) => $query->where('title', 'like', '%' . $q . '%')->orWhere('people', 'like', '%' . $q . '%')->orWhere('location', 'like', '%' . $q . '%')->orWhere('description', 'like', '%' . $q . '%'))
            ->orderBy('datetime', 'desc')
            ->paginate(request('per_page') ?? 25)
            ->withQueryString();

        return Inertia::render('records', compact('records'));
    }

    public function show(Record $record)
    {
        $record->load('category', 'statements', 'statements.account');
        foreach ($record->statements as $statement) {
            $statement->loadSum('allocations', 'amount');
        }

        $categories = Category::query()
            ->with('children')
            ->whereNull('parent_category_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('record', compact('record', 'categories'));
    }
}
