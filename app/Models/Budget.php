<?php

namespace App\Models;

use App\Pivots\BudgetRecord;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: 'string', incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
#[Hidden(['date_check'])]
class Budget extends Model
{
    public $casts = [
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];

    public function records()
    {
        return $this->belongsToMany(Record::class, BudgetRecord::class)->orderBy('datetime', 'desc');
    }
}
