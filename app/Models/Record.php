<?php

namespace App\Models;

use App\Pivots\BudgetRecord;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Builder;
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
        static::addGlobalScope('allocated', function (Builder $builder) {
            $builder->addSelect([
                'allocated_amount' => Allocation::query()
                    ->selectRaw('coalesce(round(sum(allocations.amount), 2), 0)')
                    ->whereColumn('allocations.record_id', 'records.id'),
                'statement_count' => Allocation::query()
                    ->selectRaw('count(*)')
                    ->whereColumn('allocations.record_id', 'records.id'),
            ]);
        });

        static::addGlobalScope('order', function (Builder $builder) {
            $builder
                ->orderBy('datetime', 'desc')
                ->orderBy('amount', 'asc')
                ->orderBy('title', 'asc')
                ->orderBy('people', 'asc')
                ->orderBy('location', 'asc')
                ->orderBy('description', 'asc');
        });
    }

    public static function appQuery(
        $query = null,
        $exclude_budget_id = null,
        $start_date = null,
        $end_date = null,
        $is_allocated = null,
        $category_ids = null
    ) {
        return self::query()
            ->when(
                $query,
                fn ($query, $q) => $query
                    ->where(
                        fn ($query) => $query
                            ->where('title', 'like', '%'.$q.'%')
                            ->orWhere('people', 'like', '%'.$q.'%')
                            ->orWhere('location', 'like', '%'.$q.'%')
                            ->orWhere('description', 'like', '%'.$q.'%')
                            // ->orWhere('datetime', '=', Carbon::parse($q))
                            ->orWhere('amount', 'like', '%'.$q.'%')
                    )
            )
            ->when(
                $exclude_budget_id,
                fn ($query) => $query->whereDoesntHave('budgets', fn ($query) => $query->where('budgets.id', $exclude_budget_id))
            )
            ->when(
                $start_date,
                fn ($query) => $query->whereDate('datetime', '>=', $start_date)
            )
            ->when(
                $end_date,
                fn ($query) => $query->whereDate('datetime', '<=', $end_date)
            )
            ->when(
                collect(['true', 'false'])->contains($is_allocated),
                fn ($query) => $query->havingRaw($is_allocated === 'true' ? 'allocated_amount = amount' : 'allocated_amount != amount')
            )
            ->when(
                $category_ids,
                fn ($query) => $query->whereIn('category_id', $category_ids)
            )
            ->groupBy('records.id');
    }

    public function getSubtitleAttribute()
    {
        $subtitle = '';

        if ($this->people) {
            $subtitle .= 'w/ '.$this->people;
        }

        if ($this->location) {
            if ($subtitle) {
                $subtitle .= ' @ '.$this->location;
            } else {
                $subtitle .= '@ '.$this->location;
            }
        }

        return $subtitle ?: null;
    }

    public function getIsPendingAttribute()
    {
        return $this->allocated_amount != $this->amount || $this->statement_count == 0;
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function statements()
    {
        return $this->belongsToMany(Statement::class, Allocation::class)->withPivot(['amount']);
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
