<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recurrence;
use Ramsey\Uuid\Uuid;

class RecurrenceController extends Controller
{
    public function store()
    {
        $dto = request()->validate([
            'name' => 'required|string',
            'amount' => 'required|decimal:0,2',
            'period' => 'required|in:month,year',
        ]);

        return Recurrence::query()->create([
            'id' => Uuid::uuid4(),
            ...$dto,
        ]);
    }

    public function update(Recurrence $recurrence)
    {
        $dto = request()->validate([
            'name' => 'required|string',
            'amount' => 'required|decimal:0,2',
            'period' => 'required|in:month,year',
        ]);

        $recurrence->update($dto);

        return $recurrence;
    }

    public function destroy(Recurrence $recurrence)
    {
        $recurrence->delete();

        return [];
    }
}
