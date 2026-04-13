<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: "string", incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
class Statement extends Model
{
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function allocations()
    {
        return $this->hasMany(Allocation::class, "source_statement_id");
    }

    public function records()
    {
        return $this->belongsToMany(Record::class, "allocations", "source_statement_id", "target_record_id");
    }
}
