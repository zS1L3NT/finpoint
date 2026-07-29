<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::query()
            ->with(['children' => fn ($query) => $query->withCount('records')])
            ->withCount('records')
            ->whereNull('parent_category_id')
            ->get();
    }

    public function store()
    {
        $dto = request()->validate([
            'name' => 'required|string|unique:categories,name',
            'icon' => 'required|string',
            'color' => 'required|string',
            'parent_category_id' => [
                'nullable',
                Rule::exists('categories', 'id')->whereNull('parent_category_id'),
            ],
        ]);

        $id = Str::slug($dto['name']);

        if ($id === '') {
            throw ValidationException::withMessages([
                'name' => 'The name must contain letters or numbers.',
            ]);
        }

        if (Category::query()->whereKey($id)->exists()) {
            throw ValidationException::withMessages([
                'name' => 'A category with a similar name already exists.',
            ]);
        }

        return Category::query()->create([
            'id' => $id,
            ...$dto,
        ]);
    }

    public function update(Category $category)
    {
        $dto = request()->validate([
            'name' => 'required|string|unique:categories,name,'.$category->id,
            'icon' => 'required|string',
            'color' => 'required|string',
            'parent_category_id' => [
                'nullable',
                Rule::exists('categories', 'id')->whereNull('parent_category_id'),
            ],
        ]);

        $id = Str::slug($dto['name']);

        if ($id === '') {
            throw ValidationException::withMessages([
                'name' => 'The name must contain letters or numbers.',
            ]);
        }

        if ($id !== $category->id && Category::query()->whereKey($id)->exists()) {
            throw ValidationException::withMessages([
                'name' => 'A category with a similar name already exists.',
            ]);
        }

        if ($category->parent_category_id === null && isset($dto['parent_category_id'])) {
            unset($dto['parent_category_id']);
        }

        if ($category->parent_category_id !== null && ($dto['parent_category_id'] ?? null) === $category->id) {
            throw ValidationException::withMessages([
                'parent_category_id' => 'A category cannot be its own parent.',
            ]);
        }

        $category->update([
            'id' => $id,
            ...$dto,
        ]);

        return $category;
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return [];
    }
}
