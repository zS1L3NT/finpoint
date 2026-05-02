<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Record;
use App\Models\Statement;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Ramsey\Uuid\Uuid;

class AllocatorController extends Controller
{
    public function __invoke()
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
                $allocated = $statement->allocations()->sum('amount');

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
}
