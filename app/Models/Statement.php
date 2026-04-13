<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: "string", incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
#[Hidden(["debit_amount", "credit_amount"])]
#[Appends(["amount"])]
class Statement extends Model
{
    public function getAmountAttribute()
    {
        if ($this->debit_amount != 0) {
            return -$this->debit_amount;
        } else {
            return $this->credit_amount;
        }
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
