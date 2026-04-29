<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Record;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;

class BudgetController extends Controller
{
    public function store()
    {
        $dto = request()->validate([
            'name' => 'required|string',
            'amount' => 'required|decimal:0,2',
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after:start_date',
            'automatic' => 'nullable|in:on,off',
        ]);

        return DB::transaction(function () use ($dto) {
            $budget = Budget::query()->create([
                'id' => Uuid::uuid4(),
                ...collect($dto)->except('automatic'),
                'automatic' => isset($dto['automatic']) && $dto['automatic'] === 'on',
            ]);

            if ($budget->automatic) {
                $budget->records()->attach(
                    Record::query()
                        ->whereBetween('datetime', [
                            Carbon::parse($budget->start_date)->startOfDay(),
                            Carbon::parse($budget->end_date)->endOfDay(),
                        ])
                        ->pluck('id')
                );
            }

            return $budget;
        });
    }

    public function update(Budget $budget)
    {
        $dto = request()->validate([
            'name' => 'required|string',
            'amount' => 'required|decimal:0,2',
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after:start_date',
            'automatic' => 'nullable|in:on,off',
        ]);

        $budget->update([
            ...$dto,
            'automatic' => isset($dto['automatic']) && $dto['automatic'] === 'on',
        ]);

        return $budget;
    }

    public function destroy(Budget $budget)
    {
        $budget->delete();

        return [];
    }
}
