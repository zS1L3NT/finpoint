<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::query()
            ->with("children")
            ->whereNull("parent_category_id")
            ->orderBy("name")
            ->get();

        return Inertia::render("categories/index", compact("categories"));
    }
}
