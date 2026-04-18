<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Record;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;

class BudgetController extends Controller
{
    public function store()
    {
        $dto = request()->validate([
            "name" => "required|string",
            "amount" => "required|decimal:0,2",
            "start_date" => "required|date_format:Y-m-d",
            "end_date" => "required|date_format:Y-m-d|after:start_date",
            "automatic" => "nullable|in:on"
        ]);

        return DB::transaction(function () use ($dto) {
            $budget = Budget::query()->create([
                "id" => Uuid::uuid4(),
                ...collect($dto)->except("automatic"),
                "automatic" => isset($dto["automatic"]) && $dto["automatic"] === "on"
            ]);

            if ($budget->automatic) {
                if ($budget->start_date !== null && $budget->end_date !== null) {
                    $budget->records()->attach(
                        Record::query()
                            ->whereBetween("datetime", [$budget->start_date, $budget->end_date])
                            ->get()
                    );
                }
            }

            return $budget;
        });
    }

    public function update(Budget $budget)
    {
        $dto = request()->validate([
            "name" => "required|string",
            "amount" => "required|decimal:0,2",
            "automatic" => "nullable|in:on"
        ]);

        $budget->update([
            ...$dto,
            "automatic" => isset($dto["automatic"]) && $dto["automatic"] === "on"
        ]);

        return $budget;
    }

    public function destroy(Budget $budget)
    {
        $budget->delete();

        return [];
    }
}
