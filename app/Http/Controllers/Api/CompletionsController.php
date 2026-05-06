<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Record;

class CompletionsController extends Controller
{
    public function records()
    {
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

        return compact('titles', 'locations', 'peoples');
    }
}
