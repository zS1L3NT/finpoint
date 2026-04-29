<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Allocation;
use App\Models\Record;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RecordController extends Controller
{
    public function index()
    {
        return Record::with('category')
            ->when(
                request()->query('query'),
                fn($query, $q) => $query
                    ->select('records.*')
                    ->leftJoin('categories', 'records.category_id', '=', 'categories.id')
                    ->where(
                        fn($query) => $query
                            ->where('title', 'like', '%' . $q . '%')
                            ->orWhere('people', 'like', '%' . $q . '%')
                            ->orWhere('location', 'like', '%' . $q . '%')
                            ->orWhere('description', 'like', '%' . $q . '%')
                            // ->orWhere('datetime', '=', Carbon::parse($q))
                            ->orWhere('amount', 'like', '%' . $q . '%')
                            ->orWhere('categories.name', 'like', '%' . $q . '%')
                    )
            )
            ->orderBy('datetime', 'desc')
            ->get();
    }

    public function update(Record $record)
    {
        $dto = request()->validate([
            'title' => 'required|string',
            'people' => 'nullable|string',
            'location' => 'nullable|string',
            'description' => 'nullable|string',
            'datetime' => 'required|date_format:Y-m-d\\TH:i',
            'category_id' => 'required|exists:categories,id',
            'statements' => 'required|array',
            'statements.*.id' => 'required|exists:statements,id',
            'statements.*.amount' => 'required|decimal:0,2',
        ]);

        return DB::transaction(function () use ($record, $dto) {
            $record->update([
                'amount' => round(collect($dto['statements'])->reduce(fn ($acc, $el) => $acc + $el['amount'], 0), 2),
                'datetime' => Carbon::createFromFormat('Y-m-d\\TH:i', $dto['datetime'])->format('Y-m-d H:i:s'),
                ...collect($dto)->except('statements', 'datetime'),
            ]);

            $errors = collect();

            foreach ($dto['statements'] as $i => $statement_dto) {
                $statement = $record->statements()->find($statement_dto['id']);
                $allocated = $statement->allocations()->sum('amount');

                if ($statement->amount > 0) {
                    if ($statement_dto['amount'] <= 0) {
                        $errors->put("statements.$i.amount", 'The amount must be positive');

                        continue;
                    }

                    if ($statement->amount - $allocated - $statement_dto['amount'] + $statement->pivot->amount < 0) {
                        $errors->put("statements.$i.amount", 'This amount exceeds what can be allocated');

                        continue;
                    }
                }

                if ($statement->amount < 0) {
                    if ($statement_dto['amount'] >= 0) {
                        $errors->put("statements.$i.amount", 'The amount must be negative');

                        continue;
                    }

                    if ($statement->amount - $allocated - $statement_dto['amount'] + $statement->pivot->amount > 0) {
                        $errors->put("statements.$i.amount", 'This amount exceeds what can be allocated');

                        continue;
                    }
                }
            }

            if ($errors->isNotEmpty()) {
                throw ValidationException::withMessages($errors->toArray());
            }

            foreach ($dto['statements'] as $statement_dto) {
                $record->statements()->updateExistingPivot($statement_dto['id'], [
                    'amount' => $statement_dto['amount'],
                ]);
            }

            return $record;
        });
    }

    public function destroy(Record $record)
    {
        DB::transaction(function () use ($record) {
            Allocation::query()->where('source_record_id', $record->id)->orWhere('target_record_id', $record->id)->delete();

            $record->delete();
        });

        return [];
    }
}
