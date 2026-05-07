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

    public static function appQuery(
        $query = null,
        $exclude_budget_id = null,
        $start_date = null,
        $end_date = null,
        $is_allocated = null
    ) {
        return self::query()
            ->when(
                $query,
                fn($query, $q) => $query
                    ->leftJoin('categories', 'records.category_id', '=', 'categories.id')
                    ->where(
                        fn($query) => $query
                            ->where('title', 'like', '%' . $q . '%')
                            ->orWhere('people', 'like', '%' . $q . '%')
                            ->orWhere('location', 'like', '%' . $q . '%')
                            ->orWhere('description', 'like', '%' . $q . '%')
                            // ->orWhere('datetime', '=', Carbon::parse($q))
                            ->orWhere('amount', 'like', '%' . $q . '%')
                            ->orWhere('categories.name', 'like', '%' . $q . '%')
                    )
            )
            ->when(
                $exclude_budget_id,
                fn($query) => $query->whereDoesntHave('budgets', fn($query) => $query->where('budgets.id', $exclude_budget_id))
            )
            ->when(
                $start_date,
                fn($query) => $query->whereDate('datetime', '>=', $start_date)
            )
            ->when(
                $end_date,
                fn($query) => $query->whereDate('datetime', '<=', $end_date)
            )
            ->when(
                collect(['true', 'false'])->contains($is_allocated),
                fn($query) => $query->havingRaw($is_allocated === 'true' ? 'allocated_amount = amount' : 'allocated_amount != amount')
            )
            ->orderBy('datetime', 'desc')
            ->groupBy('records.id');
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
        return $this->allocated_amount != $this->amount;
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
