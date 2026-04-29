<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Record;

class BudgetRecordController extends Controller
{
    public function attach(Budget $budget, Record $record)
    {
        $budget->records()->attach($record);

        return [];
    }

    public function detach(Budget $budget, Record $record)
    {
        $budget->records()->detach($record);

        return [];
    }
}
