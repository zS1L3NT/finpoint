<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Record;
use App\Rules\EnsureStatementAmountDoesntExceedAllocable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;

class RecordController extends Controller
{
    public function index()
    {
        return Record::appQuery(
            query: request()->query('query'),
            exclude_budget_id: request()->query('exclude_budget_id'),
            start_date: request()->query('start_date'),
            is_allocated: request()->query('is_allocated'),
        )->get();
    }

    public function store()
    {
        $dto = request()->validate([
            'title' => 'required|string',
            'people' => 'nullable|string',
            'location' => 'nullable|string',
            'description' => 'nullable|string',
            'datetime' => 'required|date_format:Y-m-d\\TH:i',
            'amount' => 'required|decimal:0,2',
            'category_id' => 'required|exists:categories,id',
            'statements' => 'array',
            'statements.*.id' => 'required|exists:statements,id',
            'statements.*.amount' => ['required', 'decimal:0,2', new EnsureStatementAmountDoesntExceedAllocable],
        ]);

        return DB::transaction(function () use ($dto) {
            $record = Record::query()->create([
                'id' => Uuid::uuid4(),
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

            $record->statements()
                ->sync(
                    collect($dto['statements'] ?? [])
                        ->mapWithKeys(fn ($statement_dto) => [
                            $statement_dto['id'] => [
                                'amount' => $statement_dto['amount'],
                            ],
                        ])
                        ->toArray()
                );

            return $record;
        });
    }

    public function show(Record $record)
    {
        $record->load('statements');

        return $record;
    }

    public function update(Record $record)
    {
        $dto = request()->validate([
            'title' => 'required|string',
            'people' => 'nullable|string',
            'location' => 'nullable|string',
            'description' => 'nullable|string',
            'datetime' => 'required|date_format:Y-m-d\\TH:i',
            'amount' => 'required|decimal:0,2',
            'category_id' => 'required|exists:categories,id',
            'statements' => 'array',
            'statements.*.id' => 'required|exists:statements,id',
            'statements.*.amount' => ['required', 'decimal:0,2', new EnsureStatementAmountDoesntExceedAllocable],
        ]);

        return DB::transaction(function () use ($record, $dto) {
            $record->update([
                'datetime' => Carbon::createFromFormat('Y-m-d\\TH:i', $dto['datetime'])->format('Y-m-d H:i:s'),
                ...collect($dto)->except('statements', 'datetime'),
            ]);

            if ($record->datetime->format('F') !== $record->quota?->month || $record->datetime->format('Y') !== (string) $record->quota?->year) {
                $record->quota()->disassociate()->save();
            }

            $record->statements()
                ->sync(
                    collect($dto['statements'] ?? [])
                        ->mapWithKeys(fn ($statement_dto) => [
                            $statement_dto['id'] => [
                                'amount' => $statement_dto['amount'],
                            ],
                        ])
                        ->toArray()
                );

            return $record;
        });
    }

    public function destroy(Record $record)
    {
        $record->delete();

        return [];
    }
}
