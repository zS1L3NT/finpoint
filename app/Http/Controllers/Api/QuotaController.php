<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quota;
use Ramsey\Uuid\Uuid;

class QuotaController extends Controller
{
    public function store()
    {
        $dto = request()->validate([
            'name' => 'required|string',
            'month' => 'required|date_format:F',
            'year' => 'required|date_format:Y',
            'amount' => 'nullable|decimal:0,2',
        ]);

        $quota = Quota::query()->create([
            'id' => Uuid::uuid4(),
            ...$dto,
            'amount' => $dto['amount'] ?? null,
        ]);

        return $quota;
    }

    public function update(Quota $quota)
    {
        $dto = request()->validate([
            'name' => 'required|string',
            'amount' => 'nullable|decimal:0,2',
        ]);

        $quota->update([
            ...$dto,
            'amount' => $dto['amount'] ?? null,
        ]);

        return $quota;
    }

    public function destroy(Quota $quota)
    {
        $quota->delete();

        return [];
    }
}
