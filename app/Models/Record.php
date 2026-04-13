<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: "string", incrementing: false)]
#[Guarded([])]
class Record extends Model
{
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function statements()
    {
        return $this->belongsToMany(Statement::class, Allocation::class, "target_record_id", "source_statement_id");
    }

    public function records()
    {
        return $this->belongsToMany(Record::class, Allocation::class, "target_record_id", "source_record_id");
    }
}
