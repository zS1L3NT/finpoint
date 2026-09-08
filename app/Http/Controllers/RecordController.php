<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Record;
use Inertia\Inertia;

class RecordController extends Controller
{
    public function index()
    {
        $categoryIds = request()->string('category_ids')->explode(',')->filter();
        $categoryIds = $categoryIds->merge(
            Category::query()->whereIn('parent_category_id', $categoryIds)->pluck('id')
        )->unique()->all();

        $records = Record::appQuery(
            query: request()->query('query'),
            start_date: request()->query('start_date'),
            end_date: request()->query('end_date'),
            is_allocated: request()->query('is_allocated'),
            category_ids: $categoryIds,
            bucket_id: request()->query('bucket_id'),
            bucket_group: request()->query('bucket_group'),
            show_unbucketed: request()->boolean('show_unbucketed'),
            treatment: request()->query('treatment'),
        )
            ->paginate(min(max(request()->integer('per_page', 100), 1), 250))
            ->withQueryString();

        return Inertia::render('records', compact('records'));
    }

    public function show(Record $record)
    {
        $statements = $record->statements;

        return Inertia::render('record', compact('record', 'statements'));
    }
}
