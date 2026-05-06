<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\CategoryController as ApiCategoryController;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = (new ApiCategoryController)->index();

        return Inertia::render('categories', compact('categories'));
    }
}
