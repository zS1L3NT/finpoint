<?php

namespace App\Models;

use App\Models\Scopes\RecordAllocatedAmount;
use App\Pivots\BudgetRecord;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: 'string', incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
#[Appends('subtitle', 'is_pending')]
class Record extends Model
{
    public $casts = [
        'datetime' => 'date:Y-m-d H:i',
    ];

    protected $with = ['category'];

    protected static function booted()
    {
        static::addGlobalScope(new RecordAllocatedAmount);
    }

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
                $subtitle .= "@ " . $this->location;
            }
        }

        return $subtitle ?: null;
    }

    public function getIsPendingAttribute()
    {
        return ($this->attributes['allocated_amount'] ?? 0) != $this->amount;
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function statements()
    {
        return $this->belongsToMany(Statement::class, Allocation::class)->orderBy('datetime', 'desc')->withPivot(['amount']);
    }

    public function budgets()
    {
        return $this->belongsToMany(Budget::class, BudgetRecord::class)->withPivot(['amount']);
    }

    public function quota()
    {
        return $this->belongsTo(Quota::class);
    }
}
