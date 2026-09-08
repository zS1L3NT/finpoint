<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: 'string', incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
class Bucket extends Model
{
    protected $casts = [
        'archived' => 'boolean',
    ];

    public function records()
    {
        return $this->hasMany(Record::class);
    }

    public function defaults()
    {
        return $this->hasMany(BucketDefault::class);
    }

    public function targets()
    {
        return $this->hasMany(BucketTarget::class);
    }
}
