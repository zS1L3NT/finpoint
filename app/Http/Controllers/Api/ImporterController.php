<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Statement;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
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
            'files' => 'required|array|min:1',
            'files.*' => 'file|extensions:csv',
        ]);

        return DB::transaction(function () {
            $imported = 0;
            $reindexed = 0;
            $skipped = 0;

            foreach (request()->file('files') as $file) {
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
                $statements = $data->map(fn ($row) => $header->combine($row));
                $statements_meta = [];
                $duplicate_counts = [];

                foreach ($statements as $statement) {
                    if ($statement['Status'] !== 'Settled') {
                        throw ValidationException::withMessages(['files' => 'Invalid CSV Format: Unsettled transaction found']);
                    }

                    $datetime = Carbon::createFromFormat('d M Y', $statement['Transaction Date'])->startOfDay();
                    $data = [
                        'account_id' => $account_id,
                        'datetime' => $datetime,
                        'description' => collect([$statement['Supplementary Code'], $statement['Client Reference'], $statement['Additional Reference']])->filter(fn ($v) => ! empty($v))->join(', '),
                        'amount' => $statement['Debit Amount'] !== null ? -$statement['Debit Amount'] : $statement['Credit Amount'],
                    ];

                    $unique_key = implode("\n", [$data['account_id'], $datetime->format('Y-m-d H:i:s'), $data['description'], $data['amount']]);
                    $duplicate_counts[$unique_key] = ($duplicate_counts[$unique_key] ?? 0) + 1;

                    $statements_meta[] = ['data' => $data, 'unique_key' => $unique_key];
                }

                // Count statements per day: ["2026-05-27" => 5]
                $statement_count_by_date = collect($statements_meta)
                    ->countBy(fn ($statement) => $statement['data']['datetime']->toDateString())
                    ->all();

                // Duplicate this variable so we can use it to count down to 1 when writing description indexes
                $duplicate_indexes = $duplicate_counts;
                $unmatched_duplicates = [];

                foreach ($statements_meta as $statement_meta) {
                    $data = $statement_meta['data'];
                    $unique_key = $statement_meta['unique_key'];

                    // DBS exports same-day rows newest-first, so decrementing makes index increase with time.
                    $date = $data['datetime']->toDateString();
                    $index = $statement_count_by_date[$date]--;

                    if ($duplicate_counts[$unique_key] > 1) {
                        $duplicate_index = $duplicate_indexes[$unique_key]--;
                        $data['description'] = $data['description'] ? "{$data['description']} #$duplicate_index" : "#$duplicate_index";
                    }

                    $existing_statement = Statement::query()->where($data)->first();

                    if ($existing_statement) {
                        if ($existing_statement->index !== $index) {
                            $existing_statement->update(['index' => $index]);
                            $reindexed++;
                        } else {
                            $skipped++;
                        }
                    } elseif ($duplicate_counts[$unique_key] > 1) {
                        // Flag as unmatched because older imports may still have the raw unlabelled description.
                        $unmatched_duplicates[$unique_key][] = [
                            'data' => $data,
                            'raw_data' => $statement_meta['data'],
                            'index' => $index,
                        ];
                    } else {
                        $imported++;
                        Statement::query()->insert([
                            'id' => Uuid::uuid4(),
                            ...$data,
                            'index' => $index,
                        ]);
                    }
                }

                // Ensure labelled duplicates are updated and matched with the correct #1, #2
                foreach ($unmatched_duplicates as $statements_meta) {
                    $existing_statement = Statement::query()->where($statements_meta[0]['raw_data'])->first();

                    if ($existing_statement) {
                        $match = collect($statements_meta)->search(fn ($statement) => $statement['index'] === $existing_statement->index);
                        $key = $match === false ? array_key_first($statements_meta) : $match;
                        $statement_meta = $statements_meta[$key];

                        $existing_statement->update([
                            'description' => $statement_meta['data']['description'],
                            'index' => $statement_meta['index'],
                        ]);
                        $reindexed++;
                        unset($statements_meta[$key]);
                    }

                    foreach ($statements_meta as $statement_meta) {
                        $imported++;
                        Statement::query()->insert([
                            'id' => Uuid::uuid4(),
                            ...$statement_meta['data'],
                            'index' => $statement_meta['index'],
                        ]);
                    }
                }
            }

            return compact('imported', 'reindexed', 'skipped');
        });
    }

    public function uob()
    {
        request()->validate([
            'files' => 'required|array|min:1',
            'files.*' => 'file|extensions:xlsx,xls',
        ]);

        return DB::transaction(function () {
            $imported = 0;
            $reindexed = 0;
            $skipped = 0;

            foreach (request()->file('files') as $file) {
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
                $statements = $data->map(fn ($row) => $header->combine($row));
                $statements_meta = [];
                $duplicate_counts = [];

                foreach ($statements as $statement) {
                    $datetime = Carbon::createFromFormat('d M Y', $statement['Transaction Date'])->startOfDay();
                    $data = [
                        'account_id' => $account_id,
                        'datetime' => $datetime,
                        'description' => $statement['Transaction Description'],
                        'amount' => $statement['Withdrawal'] != 0 ? -$statement['Withdrawal'] : $statement['Deposit'],
                    ];

                    $unique_key = implode("\n", [$data['account_id'], $datetime->format('Y-m-d H:i:s'), $data['description'], $data['amount']]);
                    $duplicate_counts[$unique_key] = ($duplicate_counts[$unique_key] ?? 0) + 1;

                    $statements_meta[] = ['data' => $data, 'unique_key' => $unique_key];
                }

                // Count statements per day: ["2026-05-27" => 5]
                $statement_count_by_date = collect($statements_meta)
                    ->countBy(fn ($statement) => $statement['data']['datetime']->toDateString())
                    ->all();

                // Duplicate this variable so we can use it to count down to 1 when writing description indexes
                $duplicate_indexes = $duplicate_counts;
                $unmatched_duplicates = [];

                foreach ($statements_meta as $statement_meta) {
                    $data = $statement_meta['data'];
                    $unique_key = $statement_meta['unique_key'];

                    // UOB exports same-day rows newest-first, so decrementing makes index increase with time.
                    $date = $data['datetime']->toDateString();
                    $index = $statement_count_by_date[$date]--;

                    if ($duplicate_counts[$unique_key] > 1) {
                        $duplicate_index = $duplicate_indexes[$unique_key]--;
                        $data['description'] = $data['description'] ? "{$data['description']} #$duplicate_index" : "#$duplicate_index";
                    }

                    $existing_statement = Statement::query()->where($data)->first();

                    if ($existing_statement) {
                        if ($existing_statement->index !== $index) {
                            $existing_statement->update(['index' => $index]);
                            $reindexed++;
                        } else {
                            $skipped++;
                        }
                    } elseif ($duplicate_counts[$unique_key] > 1) {
                        // Flag as unmatched because older imports may still have the raw unlabelled description.
                        $unmatched_duplicates[$unique_key][] = [
                            'data' => $data,
                            'raw_data' => $statement_meta['data'],
                            'index' => $index,
                        ];
                    } else {
                        $imported++;
                        Statement::query()->insert([
                            'id' => Uuid::uuid4(),
                            ...$data,
                            'index' => $index,
                        ]);
                    }
                }

                // Ensure labelled duplicates are updated and matched with the correct #1, #2
                foreach ($unmatched_duplicates as $statements_meta) {
                    $existing_statement = Statement::query()->where($statements_meta[0]['raw_data'])->first();

                    if ($existing_statement) {
                        $match = collect($statements_meta)->search(fn ($statement) => $statement['index'] === $existing_statement->index);
                        $key = $match === false ? array_key_first($statements_meta) : $match;
                        $statement_meta = $statements_meta[$key];

                        $existing_statement->update([
                            'description' => $statement_meta['data']['description'],
                            'index' => $statement_meta['index'],
                        ]);
                        $reindexed++;
                        unset($statements_meta[$key]);
                    }

                    foreach ($statements_meta as $statement_meta) {
                        $imported++;
                        Statement::query()->insert([
                            'id' => Uuid::uuid4(),
                            ...$statement_meta['data'],
                            'index' => $statement_meta['index'],
                        ]);
                    }
                }
            }

            return compact('imported', 'reindexed', 'skipped');
        });
    }

    public function revolut()
    {
        request()->validate([
            'file' => 'required|file|extensions:csv',
            'account_id' => 'required|string',
            'account_name' => 'string',
        ]);

        return DB::transaction(function () {
            $imported = 0;
            $reindexed = 0;
            $skipped = 0;

            $data = $this->parseFile(request('file'));

            if (request('account_name')) {
                Account::query()->insertOrIgnore([
                    'id' => request('account_id'),
                    'name' => request('account_name'),
                    'balance' => 0,
                    'bank' => 'Revolut',
                ]);
            }

            $header = $data->shift();
            $statements = $data->map(fn ($row) => $header->combine($row));

            foreach ($statements as $statement) {
                if ($statement['State'] !== 'COMPLETED') {
                    throw ValidationException::withMessages(['files' => 'Invalid CSV Format: Incompleted transaction found']);
                }

                $data = [
                    'account_id' => request('account_id'),
                    'datetime' => Carbon::createFromFormat('Y-m-d H:i:s', $statement['Started Date']),
                    'description' => $statement['Description'],
                    'amount' => $statement['Amount'] - $statement['Fee'],
                ];

                if (! Statement::query()->where($data)->exists()) {
                    $imported++;
                    Statement::query()->insert([
                        'id' => Uuid::uuid4(),
                        ...$data,
                    ]);
                } else {
                    $skipped++;
                }
            }

            return compact('imported', 'reindexed', 'skipped');
        });
    }

    /**
     * Summary of parseFile
     *
     * @return Collection<int, Collection<int, string | null>>
     */
    private function parseFile(UploadedFile $file)
    {
        if ($file->getClientOriginalExtension() === 'csv') {
            return collect(explode(PHP_EOL, trim($file->get())))
                ->map(
                    fn ($line) => collect(str_getcsv($line))->map(fn ($value) => $value === '' ? null : $value)
                );
        } elseif (in_array($file->getClientOriginalExtension(), ['xlsx', 'xls'])) {
            return Excel::toCollection(new stdClass, $file)->first();
        } else {
            throw ValidationException::withMessages(['files' => 'Unsupported file type']);
        }
    }
}
