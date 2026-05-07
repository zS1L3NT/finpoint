<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Allocation;
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
        return Record::query()
            ->when(
                request()->query('query'),
                fn($query, $q) => $query
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
            ->when(
                collect(['true', 'false'])->contains(request()->query('is_allocated')),
                fn($query) => $query->havingRaw(request()->query('is_allocated') === 'true' ? 'allocated_amount = amount' : 'allocated_amount != amount')
            )
            ->orderBy('datetime', 'desc')
            ->groupBy('records.id')
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
                        ->mapWithKeys(fn($statement_dto) => [
                            $statement_dto['id'] => [
                                'amount' => $statement_dto['amount']
                            ]
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
                        ->mapWithKeys(fn($statement_dto) => [
                            $statement_dto['id'] => [
                                'amount' => $statement_dto['amount']
                            ]
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
