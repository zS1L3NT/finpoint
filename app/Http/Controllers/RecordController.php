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
        request()->validate([
            "date" => "required|date_format:Y-m-d",
            "description" => "required|string",
            "category_id" => "exists:categories,id",
            "statements" => "required|array",
            "statements.*.id" => "required|exists:statements,id",
            "statements.*.amount" => "required|decimal:0,2",
            "statements.*.description" => "present"
        ]);

        $record = DB::transaction(function () {
            $record = Record::query()->create([
                "id" => Uuid::uuid4(),
                "date" => request("date"),
                "category_id" => request("category_id"),
                "amount" => round(collect(request("statements"))->reduce(fn($acc, $el) => $acc + $el["amount"], 0), 2),
                "description" => request("description")
            ]);

            foreach (request("statements") as $statement) {
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
