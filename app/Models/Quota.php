<?php

namespace App\Models;

use App\Pivots\RecordQuota;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: 'string', incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
class Quota extends Model
{
    public function records()
    {
        return $this->hasManyThrough(Record::class, RecordQuota::class, 'quota_id', 'id', 'id', 'record_id');
    }
}
