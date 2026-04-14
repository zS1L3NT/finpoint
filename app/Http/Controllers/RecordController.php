<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Models\Statement;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;

class RecordController extends Controller
{
    public function index()
    {
        $records = Record::with("category", "statements")->orderBy("date", "desc")->paginate(100);
        return Inertia::render("records/index", compact("records"));
    }

    public function store()
    {
        $dto = request()->validate([
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

        $record = DB::transaction(function () use ($dto) {
            $record = Record::query()->create([
                "id" => Uuid::uuid4(),
                "amount" => round(collect($dto["statements"])->reduce(fn($acc, $el) => $acc + $el["amount"], 0), 2),
                ...collect($dto)->except("statements")
            ]);

            $errors = collect();

            foreach ($dto["statements"] as $i => $statement_dto) {
                $statement = Statement::find($statement_dto["id"]);
                $allocated = $statement->allocations()->sum("amount");

                if ($statement->amount > 0) {
                    if ($statement_dto["amount"] <= 0) {
                        $errors->put("statements.$i.amount", "The amount must be positive");
                        continue;
                    }

                    if ($statement->amount - $allocated - $statement_dto["amount"] < 0) {
                        $errors->put("statements.$i.amount", "This amount exceeds what can be allocated");
                        continue;
                    }
                }

                if ($statement->amount < 0) {
                    if ($statement_dto["amount"] >= 0) {
                        $errors->put("statements.$i.amount", "The amount must be negative");
                        continue;
                    }

                    if ($statement->amount - $allocated - $statement_dto["amount"] > 0) {
                        $errors->put("statements.$i.amount", "This amount exceeds what can be allocated");
                        continue;
                    }
                }
            }

            if ($errors->isNotEmpty()) {
                throw ValidationException::withMessages($errors->toArray());
            }

            foreach ($dto["statements"] as $statement_dto) {
                $record->statements()->attach($statement_dto["id"], [
                    "amount" => $statement_dto["amount"],
                    "description" => $statement_dto["description"] ?: ""
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
