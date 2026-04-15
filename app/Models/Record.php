<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: "string", incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
class Record extends Model
{
    public $casts = [
        "date" => "date:Y-m-d H:i"
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function statements()
    {
        return $this->belongsToMany(Statement::class, "allocations", "target_record_id", "source_statement_id")->withPivot(["amount", "description"]);
    }

    public function records()
    {
        return $this->belongsToMany(Record::class, "allocations", "target_record_id", "source_record_id")->withPivot(["amount", "description"]);
    }
}
