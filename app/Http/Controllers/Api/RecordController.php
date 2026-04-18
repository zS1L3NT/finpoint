<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Record;

class RecordController extends Controller
{
    public function index()
    {
        $records = Record::with("category", "statements")
            ->when(request()->query("query"), fn($query, $q) => $query->where("title", "like", "%" . $q . "%")->orWhere("description", "like", "%" . $q . "%"))
            ->orderBy("datetime", "desc")
            ->get();

        return $records;
    }
}
