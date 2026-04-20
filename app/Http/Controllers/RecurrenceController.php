<?php

namespace App\Http\Controllers;

use App\Models\Recurrence;
use Inertia\Inertia;

class RecurrenceController extends Controller
{
    public function index()
    {
        $recurrences = Recurrence::query()
            ->orderBy("amount", "desc")
            ->paginate(25);

        return Inertia::render("recurrences/index", compact("recurrences"));
    }

    public function show(Recurrence $recurrence)
    {
        $recurrence->load("records", "records.category");

        return Inertia::render("recurrences/show", compact("recurrence"));
    }
}
