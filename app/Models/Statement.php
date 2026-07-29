<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: 'string', incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
#[Appends('is_unallocated')]
class Statement extends Model
{
    public $casts = [
        'datetime' => 'date:Y-m-d H:i',
        'index' => 'integer',
        'is_pending' => 'boolean',
    ];

    protected $with = ['account'];

    protected static function booted()
    {
        static::addGlobalScope('allocable', function (Builder $builder) {
            $builder->addSelect([
                'allocable_amount' => Allocation::query()
                    ->selectRaw('coalesce(round(statements.amount - sum(allocations.amount), 2), statements.amount)')
                    ->whereColumn('allocations.statement_id', 'statements.id'),
                'allocation_count' => Allocation::query()
                    ->selectRaw('count(*)')
                    ->whereColumn('allocations.statement_id', 'statements.id'),
            ]);
        });

        static::addGlobalScope('order', function (Builder $builder) {
            $builder
                ->orderBy('datetime', 'desc')
                ->orderBy('index', 'desc')
                ->orderBy('amount', 'asc')
                ->orderBy('description', 'asc');
        });
    }

    public static function appQuery(
        $query = null,
        $account_id = null,
        $exclude_ids = null,
        $start_date = null,
        $end_date = null,
        $is_allocable = null,
        $is_pending = null,
        $is_unallocated = null,
    ) {
        return self::query()
            ->when(
                $query,
                fn ($query, $q) => $query
                    ->where(
                        fn ($query) => $query
                            ->where('description', 'like', '%'.$q.'%')
                            ->orWhere('amount', 'like', '%'.$q.'%')
                            ->orWhereHas(
                                'account',
                                fn ($query) => $query
                                    ->where('id', 'like', '%'.$q.'%')
                                    ->orWhere('name', 'like', '%'.$q.'%')
                            )
                    )
            )
            ->when(
                $account_id,
                fn ($query) => $query->where('account_id', $account_id)
            )
            ->when(
                $exclude_ids,
                fn ($query) => $query->whereNotIn('statements.id', explode(',', $exclude_ids))
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
                collect(['true', 'false'])->contains($is_allocable),
                fn ($query) => $query->havingRaw($is_allocable === 'true' ? 'allocable_amount != 0' : 'allocable_amount = 0')
            )
            ->when(
                collect(['true', 'false'])->contains($is_pending),
                fn ($query) => $query->where('is_pending', $is_pending === 'true')
            )
            ->when(
                collect(['true', 'false'])->contains($is_unallocated),
                fn ($query) => $query->havingRaw($is_unallocated === 'true' ? 'allocation_count = 0' : 'allocation_count != 0')
            )
            ->groupBy('statements.id');
    }

    public function getDescriptionAttribute()
    {
        return preg_replace('/\b\d{4}-\d{4}-\d{4}-(\d{4})\b/', 'XXXX-XXXX-XXXX-$1', $this->attributes['description']);
    }

    public function getIsUnallocatedAttribute()
    {
        return $this->allocation_count == 0;
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function allocations()
    {
        return $this->hasMany(Allocation::class);
    }

    public function records()
    {
        return $this->belongsToMany(Record::class, Allocation::class)->withPivot(['amount']);
    }
}
