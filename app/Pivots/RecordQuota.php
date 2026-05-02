<?php

namespace App\Pivots;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Relations\Pivot;

#[Table(name: 'record_quota')]
#[WithoutTimestamps()]
#[Guarded([])]
class RecordQuota extends Pivot
{
    //
}
