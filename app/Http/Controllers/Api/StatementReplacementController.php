<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Statement;
use App\Support\StatementReplacement;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class StatementReplacementController extends Controller
{
    public function candidates(Statement $pending_statement, StatementReplacement $replacement)
    {
        $dto = request()->validate([
            'query' => 'nullable|string',
            'scope' => ['nullable', Rule::in(['suggested', 'all'])],
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);
        $this->ensurePending($pending_statement);

        $scope = $dto['scope'] ?? 'suggested';
        $allocations = $pending_statement->allocations()->get();
        $query = Statement::appQuery(
            query: $dto['query'] ?? null,
            account_id: $pending_statement->account_id,
            is_pending: 'false',
            is_unallocated: 'true',
        )->reorder();

        if ($scope === 'suggested') {
            $query->where('amount', $pending_statement->amount > 0 ? '>' : '<', 0);
            $query->whereBetween('datetime', [
                $pending_statement->datetime->copy()->subDays(7)->startOfDay(),
                $pending_statement->datetime->copy()->addDays(7)->endOfDay(),
            ]);
        }

        $candidates = $query->get()
            ->map(function (Statement $statement) use ($pending_statement, $allocations, $replacement) {
                $reason = $replacement->reason($statement, $pending_statement, $allocations, collect());

                return [
                    ...$statement->toArray(),
                    ...$replacement->comparison($statement, $pending_statement, $allocations),
                    'can_replace' => $reason === null,
                    'disabled_reason' => $reason,
                ];
            })
            ->when(
                $scope === 'suggested',
                fn ($items) => $items
                    ->where('can_replace', true)
                    ->where('amount_difference', '<=', 5)
            )
            ->sort(function ($a, $b) {
                return ($b['is_exact_amount'] <=> $a['is_exact_amount'])
                    ?: ($a['amount_difference'] <=> $b['amount_difference'])
                    ?: (abs($a['day_difference']) <=> abs($b['day_difference']))
                    ?: ($a['id'] <=> $b['id']);
            })
            ->values();

        $page = (int) ($dto['page'] ?? 1);
        $perPage = (int) ($dto['per_page'] ?? 25);

        return new LengthAwarePaginator(
            $candidates->forPage($page, $perPage)->values(),
            $candidates->count(),
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()],
        );
    }

    public function review(
        Statement $pending_statement,
        Statement $statement,
        StatementReplacement $replacement,
    ) {
        $this->ensurePending($pending_statement);
        $pendingAllocations = $pending_statement->allocations()->get();
        $statementAllocations = $statement->allocations()->get();
        $reason = $replacement->reason(
            $statement,
            $pending_statement,
            $pendingAllocations,
            $statementAllocations,
        );
        $records = $pending_statement->records()->get()->map(fn ($record) => [
            ...$record->toArray(),
            'allocation_amount' => (float) $record->pivot->amount,
        ]);

        return [
            'pending_statement' => $pending_statement,
            'statement' => $statement,
            'allocations' => $records,
            ...$replacement->comparison($statement, $pending_statement, $pendingAllocations),
            'can_replace' => $reason === null,
            'disabled_reason' => $reason,
        ];
    }

    private function ensurePending(Statement $statement): void
    {
        if (! $statement->is_pending) {
            throw ValidationException::withMessages([
                'pending_statement' => 'Choose a pending statement to replace.',
            ]);
        }
    }
}
