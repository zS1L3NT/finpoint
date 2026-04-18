<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ImporterController extends Controller
{
    public function index()
    {
        return Inertia::render("importer");
    }
}
