<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Record;

class BudgetRecordController extends Controller
{
    public function update(Budget $budget, Record $record)
    {
        $budget->records()->syncWithoutDetaching($record);

        return [];
    }

    public function destroy(Budget $budget, Record $record)
    {
        $budget->records()->detach($record);

        return [];
    }
}
