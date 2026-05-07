<?php

namespace App\Models;

use App\Models\Scopes\BudgetUsedScope;
use App\Pivots\BudgetRecord;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: 'string', incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
class Budget extends Model
{
    public $casts = [
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];

    protected static function booted()
    {
        static::addGlobalScope(new BudgetUsedScope);
    }

    public static function appQuery($query = null)
    {
        return self::query()
            ->when(
                $query,
                fn($query, $q) => $query
                    ->where(
                        fn($query) => $query
                            ->where('name', 'like', '%' . $q . '%')
                            ->orWhere('amount', 'like', '%' . $q . '%')
                    )
            )
            ->orderBy('end_date', 'desc')
            ->groupBy('budgets.id');
    }

    public function records()
    {
        return $this->belongsToMany(Record::class, BudgetRecord::class)->orderBy('datetime', 'desc');
    }
}
