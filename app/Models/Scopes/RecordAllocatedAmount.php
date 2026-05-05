<?php

namespace App\Models\Scopes;

use App\Models\Allocation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class RecordAllocatedAmount implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $builder->addSelect([
            'allocated_amount' => Allocation::query()
                ->selectRaw('round(sum(allocations.amount), 2)')
                ->whereColumn('allocations.target_record_id', 'records.id'),
        ]);
    }
}
