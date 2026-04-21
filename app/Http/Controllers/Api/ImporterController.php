<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Statement;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Ramsey\Uuid\Uuid;

class ImporterController extends Controller
{
    public function store()
    {
        request()->validate([
            'files' => 'required|array',
            'files.*' => 'file|extensions:csv',
        ]);

        DB::transaction(function () {
            foreach (request('files') as $file) {
                $lines = explode(PHP_EOL, $file->get());

                $account_id = '';
                $details = str_getcsv(array_shift($lines));
                if ($details[0] === 'Account Details For:') {
                    $info = explode(' ', $details[1]);

                    Account::query()->insertOrIgnore([
                        'name' => $info[0],
                        'id' => $info[1],
                        'balance' => 0,
                    ]);
                    $account_id = $info[1];
                } else {
                    throw ValidationException::withMessages(['files' => 'Invalid CSV Format']);
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

                $statements = $rows->map(fn ($row) => $header->combine(str_getcsv($row)));

                foreach ($statements as $statement) {
                    // Value Date changes across bank exports...
                    $id = Uuid::uuid5(
                        Uuid::NAMESPACE_OID,
                        collect([
                            $account_id,
                            $statement['Transaction Date'],
                            $statement['Supplementary Code'],
                            $statement['Client Reference'],
                            $statement['Additional Reference'],
                            $statement['Debit Amount'],
                            $statement['Credit Amount'],
                        ])->join(',')
                    );

                    if (! Statement::find($id)) {
                        Statement::query()->insert([
                            'account_id' => $account_id,
                            'id' => $id,
                            'date' => Carbon::createFromFormat('d M Y', $statement['Transaction Date']),
                            'description' => collect([$statement['Supplementary Code'], $statement['Client Reference'], $statement['Additional Reference']])->filter(fn ($v) => ! empty($v))->join(', '),
                            'amount' => $statement['Debit Amount'] !== '' ? -$statement['Debit Amount'] : $statement['Credit Amount'],
                        ]);
                    }
                }
            }
        });

        return [];
    }
}
