<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: 'string', incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
class Account extends Model
{
    public static function appQuery($query = null)
    {
        return self::query()
            ->withCount('statements')
            ->when(
                $query,
                fn($query, $q) => $query->where(
                    fn($query) => $query
                        ->where('name', 'like', '%' . $q . '%')
                        ->orWhere('bank', 'like', '%' . $q . '%')
                        ->orWhere('id', 'like', '%' . $q . '%')
                )
            )
            ->orderBy('bank')
            ->orderBy('name');
    }

    public function statements()
    {
        return $this->hasMany(Statement::class);
    }
}
