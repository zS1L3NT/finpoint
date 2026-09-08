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
        'revision' => 'integer',
    ];

    protected $with = ['category', 'bucket'];

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
        $category_ids = null,
        $bucket_id = null,
        $bucket_group = null,
        $show_unbucketed = false,
        $treatment = null,
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
                in_array((string) $is_allocated, ['1', '0', 'true', 'false'], true),
                fn ($query) => $query->havingRaw(
                    in_array((string) $is_allocated, ['1', 'true'], true)
                        ? 'allocated_amount = amount AND statement_count > 0'
                        : 'allocated_amount != amount OR statement_count = 0'
                )
            )
            ->when(
                $category_ids,
                fn ($query) => $query->whereIn('category_id', $category_ids)
            )
            ->when($bucket_id, fn ($query, $id) => $query->where('bucket_id', $id))
            ->when(
                $bucket_group,
                fn ($query, $group) => $query->whereHas('bucket', fn ($query) => $query->where('group', $group))
            )
            ->when($show_unbucketed, fn ($query) => $query->whereNull('bucket_id'))
            ->when($treatment, fn ($query, $value) => $query->where('analytics_treatment', $value))
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

    public function bucket()
    {
        return $this->belongsTo(Bucket::class);
    }

    public function statements()
    {
        return $this->belongsToMany(Statement::class, Allocation::class)->withPivot(['amount']);
    }

    public function budgets()
    {
        return $this->belongsToMany(Budget::class, BudgetRecord::class)->withPivot(['amount']);
    }
}
