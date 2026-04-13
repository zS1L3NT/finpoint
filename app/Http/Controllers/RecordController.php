<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Models\Statement;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;

class RecordController extends Controller
{
    public function index()
    {
        $records = Record::with("category")->orderBy("date", "desc")->paginate(100);
        return Inertia::render("Records/Index", compact("records"));
    }

    public function store()
    {
        request()->validate([
            "statement_ids" => "array",
            "statement_ids.*" => "exists:statements,id"
        ]);

        $statements = Statement::findMany(request("statement_ids"));

        $record = DB::transaction(function () use ($statements) {
            $record = Record::query()->create([
                "id" => Uuid::uuid4(),
                "date" => Carbon::today(),
                "category_id" => null,
                "amount" => round($statements->reduce(fn ($acc, $el) => $acc + $el->amount, 0), 2),
                "description" => ""
            ]);

            foreach ($statements as $statement) {
                $record->statements()->attach($statement, [
                    "amount" => $statement->amount,
                    "description" => ""
                ]);
            }

            return $record;
        });

        return redirect()->route("records.edit", $record);
    }

    public function edit(Record $record)
    {
        return Inertia::render("Records/Edit", compact("record"));
    }
}
