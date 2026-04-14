<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Models\Statement;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;

class RecordController extends Controller
{
    public function index()
    {
        $records = Record::with("category")->orderBy("date", "desc")->paginate(100);
        return Inertia::render("records/index", compact("records"));
    }

    public function store()
    {
        $data = request()->validate([
            "title" => "required|string",
            "people" => "nullable|string",
            "location" => "nullable|string",
            "date" => "required|date_format:Y-m-d",
            "category_id" => "required|exists:categories,id",
            "statements" => "required|array",
            "statements.*.id" => "required|exists:statements,id",
            "statements.*.amount" => "required|decimal:0,2",
            "statements.*.description" => "present"
        ]);

        $record = DB::transaction(function () use ($data) {
            $record = Record::query()->create([
                "id" => Uuid::uuid4(),
                "amount" => round(collect($data["statements"])->reduce(fn($acc, $el) => $acc + $el["amount"], 0), 2),
                ...collect($data)->except("statements")
            ]);

            foreach ($data["statements"] as $statement) {
                $record->statements()->attach($statement["id"], [
                    "amount" => $statement["amount"],
                    "description" => $statement["description"] ?: ""
                ]);
            }

            return $record;
        });

        return $record;
    }

    public function edit(Record $record)
    {
        return Inertia::render("records/edit", compact("record"));
    }
}
