<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Ramsey\Uuid\Uuid;

class CategoryController extends Controller
{
    public function store()
    {
        $dto = request()->validate([
            "id" => "required|string|unique:categories,id",
            "name" => "required|string|unique:categories,name",
            "icon" => "required|string",
            "color" => "required|string",
            "parent_category_id" => "nullable|exists:categories,id"
        ]);

        return Category::query()->create([
            "id" => Uuid::uuid4(),
            ...$dto
        ]);
    }

    public function update(Category $category)
    {
        $dto = request()->validate([
            "id" => "required|string|unique:categories,id," . $category->id,
            "name" => "required|string|unique:categories,name," . $category->id,
            "icon" => "required|string",
            "color" => "required|string",
            "parent_category_id" => "nullable|exists:categories,id"
        ]);

        $category->update($dto);

        return $category;
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return [];
    }
}
