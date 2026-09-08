<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Category;
use App\Models\Record;
use App\Rules\EnsureStatementAmountDoesntExceedAllocable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
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
            'analytics_treatment' => ['nullable', Rule::in(['income', 'spending', 'saving_investment', 'neutral', 'automatic'])],
            'bucket_id' => 'nullable|exists:buckets,id',
            'bucket_source' => ['nullable', Rule::in(['category', 'manual'])],
            'statements' => 'array',
            'statements.*.id' => 'required|exists:statements,id',
            'statements.*.amount' => ['required', 'decimal:0,2', new EnsureStatementAmountDoesntExceedAllocable],
        ]);

        return DB::transaction(function () use ($dto) {
            $category = Category::query()->findOrFail($dto['category_id']);
            $analytics = $this->analyticsValues($dto, $category);
            $record = Record::query()->create([
                'id' => Uuid::uuid4(),
                'datetime' => Carbon::createFromFormat('Y-m-d\\TH:i', $dto['datetime'])->format('Y-m-d H:i:s'),
                ...collect($dto)->except('statements', 'datetime', 'analytics_treatment', 'bucket_id', 'bucket_source'),
                ...$analytics,
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
            'analytics_treatment' => ['nullable', Rule::in(['income', 'spending', 'saving_investment', 'neutral', 'automatic'])],
            'bucket_id' => 'nullable|exists:buckets,id',
            'bucket_source' => ['nullable', Rule::in(['category', 'manual'])],
            'revision' => 'nullable|integer|min:1',
            'statements' => 'array',
            'statements.*.id' => 'required|exists:statements,id',
            'statements.*.amount' => ['required', 'decimal:0,2', new EnsureStatementAmountDoesntExceedAllocable],
        ]);

        return DB::transaction(function () use ($record, $dto) {
            if (isset($dto['revision']) && (int) $dto['revision'] !== $record->revision) {
                return response()->json(['message' => 'This Record changed while you were editing it.'], 409);
            }

            $category = Category::query()->findOrFail($dto['category_id']);
            $analytics = $this->analyticsValues($dto, $category, $record);
            $record->update([
                'datetime' => Carbon::createFromFormat('Y-m-d\\TH:i', $dto['datetime'])->format('Y-m-d H:i:s'),
                ...collect($dto)->except('statements', 'datetime', 'analytics_treatment', 'bucket_id', 'bucket_source', 'revision'),
                ...$analytics,
                'revision' => $record->revision + 1,
            ]);

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

    private function analyticsValues(array $dto, Category $category, ?Record $record = null): array
    {
        $explicitTreatment = array_key_exists('analytics_treatment', $dto) && $dto['analytics_treatment'];
        $treatment = $explicitTreatment ? $dto['analytics_treatment'] : ($category->analytics_treatment ?? 'automatic');
        $eligibleForBucket = $treatment === 'spending'
            || ($treatment === 'automatic' && (float) $dto['amount'] < 0);
        $bucketId = $eligibleForBucket && array_key_exists('bucket_id', $dto)
            ? ($dto['bucket_id'] ?: null)
            : ($eligibleForBucket ? ($record?->bucket_id ?? $category->default_bucket_id) : null);
        $requestedBucketSource = $dto['bucket_source'] ?? null;
        $bucketSource = match (true) {
            ! $bucketId => null,
            $requestedBucketSource === 'category' && $bucketId === $category->default_bucket_id => 'category',
            default => 'manual',
        };

        return [
            'analytics_treatment' => $treatment,
            'analytics_treatment_source' => $explicitTreatment ? 'manual' : 'category',
            'bucket_id' => $bucketId,
            'bucket_source' => $bucketSource,
        ];
    }
}
