<?php

namespace App\Support;

use App\Models\Statement;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class StatementReplacement
{
    public function reason(
        Statement $statement,
        Statement $pendingStatement,
        Collection $pendingAllocations,
        ?Collection $statementAllocations = null,
    ): ?string {
        if ($statement->is_pending) {
            return 'Choose an imported statement as the replacement.';
        }

        if (! $pendingStatement->is_pending) {
            return 'Choose a pending statement to replace.';
        }

        if ($statement->account_id !== $pendingStatement->account_id) {
            return 'The imported and pending statements must belong to the same account.';
        }

        if (($statementAllocations ?? $statement->allocations()->get())->isNotEmpty()) {
            return 'The imported statement must be fully unallocated.';
        }

        if ($pendingAllocations->isEmpty()) {
            return null;
        }

        $amount = $this->cents($statement->amount);
        $allocations = $pendingAllocations->map(fn ($allocation) => $this->cents($allocation->amount));
        $wrongSign = $amount > 0
            ? $allocations->contains(fn ($allocation) => $allocation <= 0)
            : $allocations->contains(fn ($allocation) => $allocation >= 0);

        if ($wrongSign) {
            return 'The pending allocations and imported statement must have the same direction.';
        }

        $allocated = $allocations->sum();
        if (($amount > 0 && $allocated > $amount) || ($amount < 0 && $allocated < $amount)) {
            return 'The imported statement does not have enough capacity for the pending allocations.';
        }

        return null;
    }

    public function ensureCanReplace(
        Statement $statement,
        Statement $pendingStatement,
        Collection $pendingAllocations,
        ?Collection $statementAllocations = null,
    ): void {
        $reason = $this->reason($statement, $pendingStatement, $pendingAllocations, $statementAllocations);

        if ($reason) {
            throw ValidationException::withMessages(['statement' => $reason]);
        }
    }

    public function comparison(Statement $statement, Statement $pendingStatement, Collection $allocations): array
    {
        $statementAmount = $this->cents($statement->amount);
        $pendingAmount = $this->cents($pendingStatement->amount);
        $allocated = $allocations->sum(fn ($allocation) => $this->cents($allocation->amount));
        $dayDifference = (int) round(
            ($statement->datetime->copy()->startOfDay()->timestamp
                - $pendingStatement->datetime->copy()->startOfDay()->timestamp) / 86400
        );

        return [
            'amount_difference' => abs($statementAmount - $pendingAmount) / 100,
            'day_difference' => $dayDifference,
            'is_exact_amount' => $statementAmount === $pendingAmount,
            'allocated_amount' => $allocated / 100,
            'remaining_allocable_amount' => ($statementAmount - $allocated) / 100,
        ];
    }

    public function sameDirection(Statement $statement, Statement $pendingStatement): bool
    {
        return ($this->cents($statement->amount) > 0) === ($this->cents($pendingStatement->amount) > 0);
    }

    private function cents(mixed $amount): int
    {
        $value = trim((string) $amount);
        $negative = str_starts_with($value, '-');
        $value = ltrim($value, '+-');
        [$whole, $decimal] = array_pad(explode('.', $value, 2), 2, '');

        return ($negative ? -1 : 1) * ((int) $whole * 100 + (int) str_pad(substr($decimal, 0, 2), 2, '0'));
    }
}
