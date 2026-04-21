<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Relations\Pivot;

#[Table(name: 'allocations', keyType: 'string', incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
#[Hidden(['source_check'])]
class Allocation extends Pivot
{
    //
}
