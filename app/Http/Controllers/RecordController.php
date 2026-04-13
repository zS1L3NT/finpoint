<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class RecordController extends Controller
{
    public function index()
    {
        return Inertia::render("Records/Index");
    }
}
