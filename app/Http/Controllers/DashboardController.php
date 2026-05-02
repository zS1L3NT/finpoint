<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Quota;
use App\Models\Record;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $month = request()->query('month', now()->monthName);
        $year = request()->query('year', now()->year);

        $date = Carbon::parse($month . ' ' . $year);

        $records = Record::query()
            ->with('category', 'quota')
            ->whereBetween('datetime', [$date->clone()->startOfMonth(), $date->clone()->endOfMonth()])
            ->orderBy('datetime', 'desc')
            ->get();

        $categories = Category::query()
            ->with('children')
            ->whereNull('parent_category_id')
            ->orderBy('name')
            ->get();

        $quotas = Quota::query()
            ->where('month', $month)
            ->where('year', $year)
            ->get();

        return Inertia::render('dashboard', compact('month', 'year', 'records', 'categories', 'quotas'));
    }
}
