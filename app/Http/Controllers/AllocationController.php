<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;

#[Table(keyType: "string", incrementing: false)]
#[Guarded([])]
class AllocationController extends Controller
{
    //
}
