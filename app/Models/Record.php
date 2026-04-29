<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: 'string', incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
class Record extends Model
{
    public $casts = [
        'datetime' => 'date:Y-m-d H:i',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function statements()
    {
        return $this->belongsToMany(Statement::class, 'allocations', 'target_record_id', 'source_statement_id')->withPivot(['amount']);
    }

    public function records()
    {
        return $this->belongsToMany(Record::class, 'allocations', 'target_record_id', 'source_record_id')->withPivot(['amount']);
    }

    public function budgets()
    {
        return $this->belongsToMany(Budget::class, 'budget_records', 'record_id', 'budget_id')->withPivot(['amount']);
    }

    public function recurrences()
    {
        return $this->belongsToMany(Recurrence::class, 'recurrence_records', 'record_id', 'recurrence_id');
    }
}
