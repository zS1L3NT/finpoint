<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Ramsey\Uuid\Uuid;

class CategoryController extends Controller
{
    public function store()
    {
        $dto = request()->validate([
            'id' => 'required|string|unique:categories,id',
            'name' => 'required|string|unique:categories,name',
            'icon' => 'required|string',
            'color' => 'required|string',
            'parent_category_id' => [
                'nullable',
                Rule::exists('categories', 'id')->whereNull('parent_category_id'),
            ],
        ]);

        return Category::query()->create([
            'id' => Uuid::uuid4(),
            ...$dto,
        ]);
    }

    public function update(Category $category)
    {
        $dto = request()->validate([
            'id' => 'required|string|unique:categories,id,'.$category->id,
            'name' => 'required|string|unique:categories,name,'.$category->id,
            'icon' => 'required|string',
            'color' => 'required|string',
            'parent_category_id' => [
                'nullable',
                Rule::exists('categories', 'id')->whereNull('parent_category_id'),
            ],
        ]);

        if ($category->parent_category_id === null && isset($dto['parent_category_id'])) {
            unset($dto['parent_category_id']);
        }

        if ($category->parent_category_id !== null && ($dto['parent_category_id'] ?? null) === $category->id) {
            throw ValidationException::withMessages([
                'parent_category_id' => 'A category cannot be its own parent.',
            ]);
        }

        $category->update($dto);

        return $category;
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return [];
    }
}
