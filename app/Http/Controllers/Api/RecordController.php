<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Allocation;
use App\Models\Budget;
use App\Models\Record;
use App\Models\Statement;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Ramsey\Uuid\Uuid;

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
            ->when(
                request()->query('exclude_budget_id'),
                fn($query, $id) => $query
                    ->whereDoesntHave('budgets', fn($query) => $query->where('budgets.id', $id))
            )
            ->orderBy('datetime', 'desc')
            ->get();
    }

    public function store()
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

        return DB::transaction(function () use ($dto) {
            $record = Record::query()->create([
                'id' => Uuid::uuid4(),
                'amount' => round(collect($dto['statements'])->reduce(fn ($acc, $el) => $acc + $el['amount'], 0), 2),
                'datetime' => Carbon::createFromFormat('Y-m-d\\TH:i', $dto['datetime'])->format('Y-m-d H:i:s'),
                ...collect($dto)->except('statements', 'datetime'),
            ]);

            // If the record falls within a budget range and the budget is automatic, add it to that budget
            $budgets = Budget::query()
                ->where('start_date', '<=', $record->datetime)
                ->where('end_date', '>=', $record->datetime)
                ->where('automatic', true)
                ->get();
            foreach ($budgets as $budget) {
                /** @var Budget $budget */
                $budget->records()->attach($record);
            }

            $record->quota_pivot()->create();

            $errors = collect();

            foreach ($dto['statements'] as $i => $statement_dto) {
                $statement = Statement::find($statement_dto['id']);
                $allocated = round($statement->allocations()->sum('amount'), 2);

                if ($statement->amount > 0) {
                    if ($statement_dto['amount'] <= 0) {
                        $errors->put("statements.$i.amount", 'The amount must be positive');

                        continue;
                    }

                    if (round($statement->amount - $allocated - $statement_dto['amount'], 2) < 0) {
                        $errors->put("statements.$i.amount", 'This amount exceeds what can be allocated');

                        continue;
                    }
                }

                if ($statement->amount < 0) {
                    if ($statement_dto['amount'] >= 0) {
                        $errors->put("statements.$i.amount", 'The amount must be negative');

                        continue;
                    }

                    if (round($statement->amount - $allocated - $statement_dto['amount'], 2) > 0) {
                        $errors->put("statements.$i.amount", 'This amount exceeds what can be allocated');

                        continue;
                    }
                }
            }

            if ($errors->isNotEmpty()) {
                throw ValidationException::withMessages($errors->toArray());
            }

            foreach ($dto['statements'] as $statement_dto) {
                $record->statements()->attach($statement_dto['id'], [
                    'amount' => $statement_dto['amount'],
                ]);
            }

            return $record;
        });
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
                'amount' => round(collect($dto['statements'])->reduce(fn($acc, $el) => $acc + $el['amount'], 0), 2),
                'datetime' => Carbon::createFromFormat('Y-m-d\\TH:i', $dto['datetime'])->format('Y-m-d H:i:s'),
                ...collect($dto)->except('statements', 'datetime'),
            ]);

            if ($record->datetime->format('F') !== $record->quota->month || $record->datetime->format('Y') !== $record->quota->year) {
                $record->quota_pivot()->update(['quota_id' => null]);
            }

            $errors = collect();

            foreach ($dto['statements'] as $i => $statement_dto) {
                $statement = $record->statements()->find($statement_dto['id']);
                $allocated = round($statement->allocations()->sum('amount'), 2);

                if ($statement->amount > 0) {
                    if ($statement_dto['amount'] <= 0) {
                        $errors->put("statements.$i.amount", 'The amount must be positive');

                        continue;
                    }

                    if (round($statement->amount - $allocated - $statement_dto['amount'] + $statement->pivot->amount, 2) < 0) {
                        $errors->put("statements.$i.amount", 'This amount exceeds what can be allocated');

                        continue;
                    }
                }

                if ($statement->amount < 0) {
                    if ($statement_dto['amount'] >= 0) {
                        $errors->put("statements.$i.amount", 'The amount must be negative');

                        continue;
                    }

                    if (round($statement->amount - $allocated - $statement_dto['amount'] + $statement->pivot->amount, 2) > 0) {
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
