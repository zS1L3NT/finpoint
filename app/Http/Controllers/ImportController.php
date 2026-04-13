<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Statement;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ImportController extends Controller
{
    public function index()
    {
        return Inertia::render("Import");
    }

    public function store()
    {
        request()->validate([
            "files" => "required|array",
            "files.*" => "file|extensions:csv"
        ]);

        DB::transaction(function () {
            foreach (request("files") as $file) {
                $lines = explode(PHP_EOL, $file->get());

                $account_id = "";
                $details = str_getcsv(array_shift($lines));
                if ($details[0] === "Account Details For:") {
                    $info = explode(" ", $details[1]);

                    Account::query()->insertOrIgnore([
                        "name" => $info[0],
                        "id" => $info[1],
                        "balance" => 0
                    ]);
                    $account_id = $info[1];
                } else {
                    throw ValidationException::withMessages(["files" => "Invalid CSV Format"]);
                }

                array_shift($lines); // Statement as at: XX XXX XXXX

                array_shift($lines); // 

                array_shift($lines); // Currency: SGD - Singapore Dollar

                array_shift($lines); // 

                array_shift($lines); // Available Balance: $XXXX.XX

                array_shift($lines); // Ledger Balance: $XXXX.XX

                array_shift($lines); // 

                $header = collect(str_getcsv(array_shift($lines)));
                $rows = collect($lines);

                $statements = $rows->map(fn($row) => $header->combine(str_getcsv($row)));

                foreach ($statements as $statement) {
                    $id = hash("sha256", $statement->values()->join(","));

                    if (!Statement::find($id)) {
                        Statement::query()->insert([
                            "account_id" => $account_id,
                            "id" => $id,
                            "transaction_date" => Carbon::createFromFormat("d M Y", $statement["Transaction Date"])->format("Y-m-d"),
                            "value_date" => Carbon::createFromFormat("d M Y", $statement["Value Date"])->format("Y-m-d"),
                            "statement_code" => $statement["Statement Code"],
                            "description" => $statement["Description"],
                            "supplementary_code" => $statement["Supplementary Code"],
                            "supplementary_code_description" => $statement["Supplementary Code Description"],
                            "client_reference" => $statement["Client Reference"],
                            "additional_reference" => $statement["Additional Reference"],
                            "status" => $statement["Status"],
                            "currency" => $statement["Currency"],
                            "debit_amount" => $statement["Debit Amount"] !== "" ? $statement["Debit Amount"] : null,
                            "credit_amount" => $statement["Credit Amount"] !== "" ? $statement["Credit Amount"] : null,
                        ]);
                    }
                }
            }
        });

        return redirect()->route("statements.index");
    }
}
