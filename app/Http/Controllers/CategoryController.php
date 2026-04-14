<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::query()
            ->with("children")
            ->withCount("records")
            ->whereNull("parent_category_id")
            ->orderBy("name")
            ->get();

        return Inertia::render("categories/index", compact("categories"));
    }

    public function store()
    {
        $data = request()->validate([
            "name" => "required|string|unique:categories,name",
            "icon" => "required|string",
            "color" => "required|string",
            "parent_category_id" => "nullable|exists:categories,id"
        ]);

        $category = Category::query()->create([
            "id" => Uuid::uuid4(),
            ...$data
        ]);

        return $category;
    }

    public function update(Category $category)
    {
        $data = request()->validate([
            "name" => "string|unique:categories,name",
            "icon" => "string",
            "color" => "string",
        ]);

        $category->update($data);

        return $category;
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return [];
    }
}
