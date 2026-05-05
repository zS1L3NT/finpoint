<?php

namespace App\Models;

use App\Models\Scopes\StatementAllocableScope;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: 'string', incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
class Statement extends Model
{
    public $casts = [
        'datetime' => 'date:Y-m-d H:i',
    ];

    protected $with = ['account'];

    protected static function booted()
    {
        static::addGlobalScope(new StatementAllocableScope);
    }

    public function getDescriptionAttribute()
    {
        return preg_replace('/\b\d{4}-\d{4}-\d{4}-(\d{4})\b/', 'XXXX-XXXX-XXXX-$1', $this->attributes['description']);
    }

    public function getAllocableAmountAttribute()
    {
        return $this->attributes['allocable_amount'] ?? $this->amount;
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function allocations()
    {
        return $this->hasMany(Allocation::class, 'source_statement_id');
    }

    public function records()
    {
        return $this->belongsToMany(Record::class, 'allocations', 'source_statement_id', 'target_record_id')->withPivot(['amount']);
    }
}
