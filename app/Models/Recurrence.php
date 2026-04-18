<?php

namespace App\Models;

use App\Pivots\RecurrenceRecord;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: "string", incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
class Recurrence extends Model
{
    public function records()
    {
        return $this->belongsToMany(Record::class, RecurrenceRecord::class)->orderBy("datetime", "desc");
    }
}
