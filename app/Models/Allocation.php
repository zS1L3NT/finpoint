<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\Pivot;

#[Table(keyType: "string", incrementing: false)]
#[Guarded([])]
#[Hidden(["source_check"])]
class Allocation extends Pivot
{
    //
}
