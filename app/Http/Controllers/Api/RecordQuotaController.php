<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quota;
use App\Models\Record;

class RecordQuotaController extends Controller
{
    public function attach(Record $record, Quota $quota)
    {
        $record->quota_pivot()->update(['quota_id' => $quota->id]);

        return [];
    }


    public function detach(Record $record, Quota $quota)
    {
        $record->quota_pivot()->update(['quota_id' => null]);

        return [];
    }
}
