<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bucket;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BucketController extends Controller
{
    public function index()
    {
        return Bucket::query()->orderBy('display_order')->get();
    }

    public function store()
    {
        $dto = request()->validate([
            'name' => 'required|string|max:100|unique:buckets,name',
            'color' => 'required|string|max:40',
            'group' => ['required', Rule::in(['core', 'outlier', 'other'])],
            'pace_kind' => ['required', Rule::in(['daily', 'recurring', 'none'])],
        ]);

        return Bucket::query()->create([
            'id' => (string) Str::uuid(),
            ...$dto,
            'display_order' => ((int) Bucket::query()->max('display_order')) + 10,
        ]);
    }

    public function update(Bucket $bucket)
    {
        $dto = request()->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('buckets', 'name')->ignore($bucket->id)],
            'color' => 'required|string|max:40',
            'group' => ['required', Rule::in(['core', 'outlier', 'other'])],
            'pace_kind' => ['required', Rule::in(['daily', 'recurring', 'none'])],
            'archived' => 'required|boolean',
        ]);
        if ($dto['group'] === 'outlier') {
            $dto['pace_kind'] = 'none';
        }

        $bucket->update($dto);

        return $bucket;
    }

    public function target(Bucket $bucket)
    {
        $dto = request()->validate([
            'month' => 'required|date_format:Y-m-d',
            'amount' => 'nullable|decimal:0,2|min:0',
            'scope' => ['required', Rule::in(['month', 'default'])],
        ]);

        $key = $dto['scope'] === 'month' ? 'month' : 'effective_month';
        $table = $dto['scope'] === 'month' ? 'bucket_targets' : 'bucket_defaults';
        DB::table($table)->updateOrInsert(
            ['bucket_id' => $bucket->id, $key => $dto['month']],
            ['amount' => $dto['amount'] ?? null],
        );

        return [];
    }
}
