<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Record;
use App\Models\Recurrence;

class RecurrenceRecordController extends Controller
{
    public function attach(Recurrence $recurrence, Record $record)
    {
        $recurrence->records()->attach($record);

        return [];
    }

    public function detach(Recurrence $recurrence, Record $record)
    {
        $recurrence->records()->detach($record);

        return [];
    }
}
