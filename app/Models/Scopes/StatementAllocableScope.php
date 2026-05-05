<?php

namespace App\Models\Scopes;

use App\Models\Allocation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class StatementAllocableScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $builder->addSelect([
            'allocable_amount' => Allocation::query()
                ->selectRaw('round(statements.amount - sum(allocations.amount), 2)')
                ->whereColumn('allocations.source_statement_id', 'statements.id'),
        ]);
    }
}
