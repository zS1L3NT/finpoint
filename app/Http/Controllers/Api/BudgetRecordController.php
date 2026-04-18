<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Record;
use Illuminate\Http\Request;

class BudgetRecordController extends Controller
{
    public function store(Budget $budget)
    {
        $dto = request()->validate([
            "record_id" => "exists:records,id"
        ]);

        $budget->records()->attach($dto["record_id"]);

        return [];
    }

    public function destroy(Budget $budget, Record $record)
    {
        $budget->records()->detach($record);

        return [];
    }
}
