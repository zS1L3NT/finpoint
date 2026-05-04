<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quota;
use App\Models\Record;

class RecordQuotaController extends Controller
{
    public function attach(Record $record, Quota $quota)
    {
        $record->quota()->associate($quota)->save();

        return [];
    }

    public function detach(Record $record)
    {
        $record->quota()->dissociate()->save();

        return [];
    }
}
