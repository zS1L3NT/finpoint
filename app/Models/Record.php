<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: "string", incrementing: false)]
#[Guarded([])]
class Record extends Model
{
    // 
}
