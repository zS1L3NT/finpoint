<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recurrence;
use App\Models\Record;

class RecurrenceRecordController extends Controller
{
    public function update(Recurrence $recurrence, Record $record)
    {
        $recurrence->records()->attach($record);

        return [];
    }

    public function destroy(Recurrence $recurrence, Record $record)
    {
        $recurrence->records()->detach($record);

        return [];
    }
}
