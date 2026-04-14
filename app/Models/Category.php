<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(keyType: "string", incrementing: false)]
#[WithoutTimestamps()]
#[Guarded([])]
class Category extends Model
{
    public function records()
    {
        return $this->hasMany(Record::class);
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, "parent_category_id");
    }

    public function children()
    {
        return $this->hasMany(Category::class, "parent_category_id")->orderBy("name");
    }
}
