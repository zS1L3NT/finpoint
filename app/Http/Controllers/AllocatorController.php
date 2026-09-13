<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Statement;
use App\Support\StatementReplacement;
use Inertia\Inertia;

class AllocatorController extends Controller
{
    public function index()
    {
        $statements = Statement::appQuery(
            query: request()->query('query'),
            account_id: request()->query('account_id'),
            start_date: request()->query('start_date'),
            end_date: request()->query('end_date'),
            is_allocable: 'true'
        )
            ->paginate(request()->query('per_page') ?? 100)
            ->withQueryString();
        $accounts = Account::appQuery()->get();

        return Inertia::render('allocator', compact('statements', 'accounts'));
    }

    public function pending(StatementReplacement $replacement)
    {
        $pendingStatements = Statement::appQuery(
            query: request()->query('query'),
            account_id: request()->query('account_id'),
            is_pending: 'true',
        )
            ->reorder()
            ->orderBy('datetime')
            ->orderBy('id')
            ->paginate(min(max(request()->integer('per_page', 25), 1), 100))
            ->withQueryString();

        $pendingStatements->getCollection()->load('allocations');
        $pending = $pendingStatements->getCollection();
        $imports = $pending->isEmpty()
            ? collect()
            : Statement::appQuery(is_pending: 'false', is_unallocated: 'true')
                ->whereIn('account_id', $pending->pluck('account_id')->unique())
                ->whereBetween('datetime', [
                    $pending->min('datetime')->copy()->subDays(7)->startOfDay(),
                    $pending->max('datetime')->copy()->addDays(7)->endOfDay(),
                ])
                ->get()
                ->groupBy('account_id');

        $pending->each(function (Statement $statement) use ($imports, $replacement) {
            $count = $imports->get($statement->account_id, collect())
                ->filter(fn ($imported) => $replacement->sameDirection($imported, $statement))
                ->filter(fn ($imported) => abs($replacement->comparison(
                    $imported,
                    $statement,
                    $statement->allocations,
                )['day_difference']) <= 7)
                ->filter(fn ($imported) => $replacement->comparison(
                    $imported,
                    $statement,
                    $statement->allocations,
                )['amount_difference'] <= 5)
                ->filter(fn ($imported) => $replacement->reason(
                    $imported,
                    $statement,
                    $statement->allocations,
                    collect(),
                ) === null)
                ->count();
            $statement->setAttribute('suggestion_count', $count);
            $statement->unsetRelation('allocations');
        });

        $selectedId = request()->query('pending_statement_id');
        $selectedPendingStatement = $selectedId
            ? Statement::query()->where('is_pending', true)->find($selectedId)
            : null;
        $selectionMissing = (bool) $selectedId && ! $selectedPendingStatement;
        $accounts = Account::appQuery()->get();

        return Inertia::render('allocator-pending', compact(
            'pendingStatements',
            'selectedPendingStatement',
            'selectionMissing',
            'accounts',
        ));
    }
}
