<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Record;
use App\Models\Recurrence;

class RecurrenceRecordController extends Controller
{
    public function update(Recurrence $recurrence, Record $record)
    {
        $recurrence->records()->syncWithoutDetaching($record);

        return [];
    }

    public function destroy(Recurrence $recurrence, Record $record)
    {
        $recurrence->records()->detach($record);

        return [];
    }
}
