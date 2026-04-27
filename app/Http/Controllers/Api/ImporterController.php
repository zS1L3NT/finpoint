<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Statement;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;
use Ramsey\Uuid\Uuid;
use stdClass;

class ImporterController extends Controller
{
    public function dbs()
    {
        request()->validate([
            'files.*' => 'file|extensions:csv',
        ]);

        return DB::transaction(function () {
            $imported = 0;
            $skipped = 0;

            foreach (request('files') as $file) {
                $data = $this->parseFile($file);

                $account_id = '';
                $details = $data->shift();
                if ($details[0] === 'Account Details For:') {
                    $info = explode(' ', $details[1]);
                    $account_id = Str::replace('-', '', $info[1]);

                    Account::query()->insertOrIgnore([
                        'id' => $account_id,
                        'name' => $info[0],
                        'balance' => 0,
                        'bank' => 'DBS',
                    ]);
                } else {
                    throw ValidationException::withMessages(['files' => 'Invalid CSV Format: Missing Account details']);
                }

                $data->shift(); // Statement as at: XX XXX XXXX

                $data->shift(); //

                $data->shift(); // Currency: SGD - Singapore Dollar

                $data->shift(); //

                $data->shift(); // Available Balance: $XXXX.XX

                $data->shift(); // Ledger Balance: $XXXX.XX

                $data->shift(); //

                $header = $data->shift();
                $statements = $data->map(fn($row) => $header->combine($row));

                foreach ($statements as $statement) {
                    if ($statement['Status'] !== 'Settled') {
                        throw ValidationException::withMessages(['files' => 'Invalid CSV Format: Unsettled transaction found']);
                    }

                    $data = [
                        'account_id' => $account_id,
                        'date' => Carbon::createFromFormat('d M Y', $statement['Transaction Date'])->startOfDay(),
                        'description' => collect([$statement['Supplementary Code'], $statement['Client Reference'], $statement['Additional Reference']])->filter(fn($v) => !empty($v))->join(', '),
                        'amount' => $statement['Debit Amount'] !== null ? -$statement['Debit Amount'] : $statement['Credit Amount'],
                    ];

                    if (!Statement::query()->where($data)->exists()) {
                        $imported++;
                        Statement::query()->insert([
                            'id' => Uuid::uuid4(),
                            ...$data
                        ]);
                    } else {
                        $skipped++;
                    }
                }
            }

            return compact('imported', 'skipped');
        });
    }

    public function uob()
    {
        request()->validate([
            'files.*' => 'file|extensions:xlsx,xls',
        ]);

        return DB::transaction(function () {
            $imported = 0;
            $skipped = 0;

            foreach (request('files') as $file) {
                $data = $this->parseFile($file);

                $data->shift(); // United Overseas Bank Limited. Company Reg No. 193500026Z

                $data->shift(); //

                $data->shift(); // Account Statement Details

                $data->shift(); //

                $account_id = '';
                $details = $data->shift();
                if ($details[0] === 'Account Number:') {
                    $account_id = $details[1];
                } else {
                    throw ValidationException::withMessages(['files' => 'Invalid CSV Format: Missing Account Number']);
                }

                $account_name = '';
                $details = $data->shift();
                if ($details[0] === 'Account Type:') {
                    $account_name = $details[1];
                } else {
                    throw ValidationException::withMessages(['files' => 'Invalid CSV Format: Missing Account Type']);
                }

                $data->shift(); // Statement Period: XX XXX XXXX to XX XXX XXXX

                Account::query()->insertOrIgnore([
                    'id' => $account_id,
                    'name' => $account_name,
                    'balance' => 0,
                    'bank' => 'UOB',
                ]);

                $header = $data->shift();
                $statements = $data->map(fn($row) => $header->combine($row));

                foreach ($statements as $statement) {
                    $data = [
                        'account_id' => $account_id,
                        'date' => Carbon::createFromFormat('d M Y', $statement['Transaction Date'])->startOfDay(),
                        'description' => $statement['Transaction Description'],
                        'amount' => $statement['Withdrawal'] !== 0 ? -$statement['Withdrawal'] : $statement['Deposit'],
                    ];

                    if (!Statement::query()->where($data)->exists()) {
                        $imported++;
                        Statement::query()->insert([
                            'id' => Uuid::uuid4(),
                            ...$data
                        ]);
                    } else {
                        $skipped++;
                    }
                }
            }

            return compact('imported', 'skipped');
        });
    }

    public function revolut()
    {
        request()->validate([
            'file' => 'file|extensions:csv',
            'account_id' => 'required|string',
            'account_name' => 'string',
        ]);

        return DB::transaction(function () {
            $imported = 0;
            $skipped = 0;

            $data = $this->parseFile(request('file'));

            if (request('account_name')) {
                Account::query()->insert([
                    'id' => request('account_id'),
                    'name' => request('account_name'),
                    'balance' => 0,
                    'bank' => 'Revolut',
                ]);
            }

            $header = $data->shift();
            $statements = $data->map(fn($row) => $header->combine($row));

            foreach ($statements as $statement) {
                if ($statement['State'] !== 'COMPLETED') {
                    throw ValidationException::withMessages(['files' => 'Invalid CSV Format: Incompleted transaction found']);
                }

                $data = [
                    'account_id' => request('account_id'),
                    'date' => Carbon::createFromFormat('Y-m-d H:i:s', $statement['Started Date']),
                    'description' => $statement['Description'],
                    'amount' => $statement['Amount'] - $statement['Fee'],
                ];

                if (!Statement::query()->where($data)->exists()) {
                    $imported++;
                    Statement::query()->insert([
                        'id' => Uuid::uuid4(),
                        ...$data
                    ]);
                } else {
                    $skipped++;
                }
            }

            return compact('imported', 'skipped');
        });
    }

    /**
     * Summary of parseFile
     * @param UploadedFile $file
     * @return \Illuminate\Support\Collection<int, \Illuminate\Support\Collection<int, string | null>>
     */
    private function parseFile(UploadedFile $file)
    {
        if ($file->getClientOriginalExtension() === 'csv') {
            return collect(explode(PHP_EOL, trim($file->get())))
                ->map(
                    fn($line) =>
                    collect(str_getcsv($line))->map(fn($value) => $value === '' ? null : $value)
                );
        } elseif (in_array($file->getClientOriginalExtension(), ['xlsx', 'xls'])) {
            return Excel::toCollection(new stdClass(), $file)->first();
        } else {
            throw ValidationException::withMessages(['files' => 'Unsupported file type']);
        }
    }
}
