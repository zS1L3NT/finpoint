<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Statement;
use App\Support\StatementReplacement;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Ramsey\Uuid\Uuid;

class StatementController extends Controller
{
    public function index()
    {
        return Statement::appQuery(
            query: request()->query('query'),
            account_id: request()->query('account_id'),
            exclude_ids: request()->query('exclude_ids'),
            start_date: request()->query('start_date'),
            end_date: request()->query('end_date'),
            is_allocable: request()->query('is_allocable'),
            is_pending: request()->query('is_pending'),
            is_unallocated: request()->query('is_unallocated'),
        )->get();
    }

    public function store()
    {
        $dto = $this->validateStatement();

        return Statement::query()->create([
            'id' => Uuid::uuid4(),
            'account_id' => $dto['account_id'],
            'datetime' => Carbon::createFromFormat('Y-m-d\TH:i', $dto['datetime']),
            'description' => $dto['description'],
            'amount' => $dto['amount'],
            'index' => 0,
            'is_pending' => true,
        ]);
    }

    public function update(Statement $statement)
    {
        $this->ensurePending($statement);
        $dto = $this->validateStatement();
        $this->ensureAllocationsFit($dto['amount'], $statement->allocations()->get());

        $statement->update([
            'account_id' => $dto['account_id'],
            'datetime' => Carbon::createFromFormat('Y-m-d\TH:i', $dto['datetime']),
            'description' => $dto['description'],
            'amount' => $dto['amount'],
        ]);

        return $statement;
    }

    public function destroy(Statement $statement)
    {
        $this->ensurePending($statement);

        if ($statement->allocations()->exists()) {
            throw ValidationException::withMessages([
                'statement' => 'Remove every allocation before deleting this pending statement.',
            ]);
        }

        $statement->delete();

        return [];
    }

    public function replacePending(
        Statement $statement,
        Statement $pending_statement,
        StatementReplacement $replacement,
    ) {
        return DB::transaction(function () use ($statement, $pending_statement, $replacement) {
            $statement = Statement::query()->lockForUpdate()->findOrFail($statement->id);
            $pending_statement = Statement::query()->lockForUpdate()->findOrFail($pending_statement->id);
            $statementAllocations = $statement->allocations()->lockForUpdate()->get();
            $pendingAllocations = $pending_statement->allocations()->lockForUpdate()->get();
            $replacement->ensureCanReplace(
                $statement,
                $pending_statement,
                $pendingAllocations,
                $statementAllocations,
            );

            $pending_statement->allocations()->update(['statement_id' => $statement->id]);
            $pending_statement->delete();

            return $statement->fresh();
        });
    }

    private function validateStatement()
    {
        return request()->validate([
            'account_id' => 'required|exists:accounts,id',
            'datetime' => 'required|date_format:Y-m-d\TH:i',
            'amount' => 'required|decimal:0,2|not_in:0,0.0,0.00,-0,-0.0,-0.00',
            'description' => 'required|string',
        ]);
    }

    private function ensurePending(Statement $statement)
    {
        if (! $statement->is_pending) {
            throw ValidationException::withMessages([
                'statement' => 'Imported statements are read-only.',
            ]);
        }
    }

    private function ensureAllocationsFit($amount, Collection $allocations)
    {
        if ($allocations->isEmpty()) {
            return;
        }

        $allocated = round($allocations->sum('amount'), 2);
        $wrong_sign = $amount > 0
            ? $allocations->contains(fn ($allocation) => $allocation->amount <= 0)
            : $allocations->contains(fn ($allocation) => $allocation->amount >= 0);
        $overallocated = $amount > 0 ? $allocated > $amount : $allocated < $amount;

        if ($wrong_sign || $overallocated) {
            throw ValidationException::withMessages([
                'amount' => 'The amount would over-allocate this statement.',
            ]);
        }
    }
}
