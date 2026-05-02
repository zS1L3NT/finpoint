<?php

namespace App\Models;

use App\Pivots\RecordQuota;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: 'string', incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
#[Appends('subtitle')]
class Record extends Model
{
    public $casts = [
        'datetime' => 'date:Y-m-d H:i',
    ];

    public function getSubtitleAttribute()
    {
        $subtitle = "";

        if ($this->people) {
            $subtitle .= "w/ " . $this->people;
        }

        if ($this->location) {
            if ($subtitle) {
                $subtitle .= " @ " . $this->location;
            } else {
                $subtitle .= "@" . $this->location;
            }
        }

        return $subtitle ?: null;
    }

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

    public function quota()
    {
        return $this->hasOneThrough(Quota::class, RecordQuota::class, 'record_id', 'id', 'id', 'quota_id');
    }

    public function quota_pivot()
    {
        return $this->hasOne(RecordQuota::class, 'record_id');
    }
}
