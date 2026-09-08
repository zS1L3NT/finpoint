<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('buckets', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name')->unique();
            $table->string('color');
            $table->string('group')->default('other');
            $table->string('pace_kind')->default('none');
            $table->integer('display_order')->default(0);
            $table->boolean('archived')->default(false);
        });

        Schema::create('bucket_defaults', function (Blueprint $table) {
            $table->string('bucket_id')->references('id')->on('buckets')->constrained()->cascadeOnDelete();
            $table->date('effective_month');
            $table->decimal('amount')->nullable();
            $table->primary(['bucket_id', 'effective_month']);
        });

        Schema::create('bucket_targets', function (Blueprint $table) {
            $table->string('bucket_id')->references('id')->on('buckets')->constrained()->cascadeOnDelete();
            $table->date('month');
            $table->decimal('amount')->nullable();
            $table->primary(['bucket_id', 'month']);
        });

        Schema::create('analytics_months', function (Blueprint $table) {
            $table->date('month')->primary();
            $table->string('coverage')->default('unknown');
            $table->date('covered_through')->nullable();
            $table->boolean('excluded_from_comparisons')->default(false);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->string('analytics_treatment')->nullable();
            $table->string('default_bucket_id')->nullable()->references('id')->on('buckets')->constrained()->nullOnDelete();
        });

        Schema::table('records', function (Blueprint $table) {
            $table->string('bucket_id')->nullable()->references('id')->on('buckets')->constrained()->nullOnDelete();
            $table->string('bucket_source')->nullable();
            $table->string('analytics_treatment')->nullable();
            $table->string('analytics_treatment_source')->nullable();
            $table->integer('revision')->default(1);
            $table->index(['datetime', 'analytics_treatment']);
            $table->index(['bucket_id', 'datetime']);
        });

        $this->backfill();
        $this->dropLegacyQuotaSchema();
    }

    private function backfill(): void
    {
        $bucketSettings = [
            'Daily' => ['Daily', 'core', 'daily', 10],
            'Recurring' => ['Recurring', 'core', 'recurring', 20],
            'Savings' => ['Irregular', 'outlier', 'none', 30],
            'Holiday' => ['Holiday', 'outlier', 'none', 40],
        ];

        $bucketIds = [];
        $quotaBucketIds = [];
        foreach (DB::table('quotas')->orderBy('year')->get()->groupBy('name') as $quotaName => $quotas) {
            [$name, $group, $paceKind, $displayOrder] = $bucketSettings[$quotaName]
                ?? [$quotaName, 'other', 'none', 100 + count($bucketIds)];
            $bucketId = (string) Str::uuid();
            $latest = $quotas->sortByDesc(fn ($quota) => sprintf('%04d-%02d', $quota->year, Carbon::createFromFormat('F', $quota->month)->month))->first();

            DB::table('buckets')->insert([
                'id' => $bucketId,
                'name' => $name,
                'color' => $latest->color,
                'group' => $group,
                'pace_kind' => $paceKind,
                'display_order' => $displayOrder,
            ]);

            foreach ($quotas as $quota) {
                $month = Carbon::createFromFormat('F Y', $quota->month.' '.$quota->year)->startOfMonth()->toDateString();
                $quotaBucketIds[$quota->id] = $bucketId;
                DB::table('bucket_targets')->insert([
                    'bucket_id' => $bucketId,
                    'month' => $month,
                    'amount' => $quota->amount,
                ]);
            }

            $nonFuture = $quotas->filter(function ($quota) {
                return Carbon::createFromFormat('F Y', $quota->month.' '.$quota->year)->startOfMonth()->lte(now()->startOfMonth());
            })->sortByDesc(fn ($quota) => sprintf('%04d-%02d', $quota->year, Carbon::createFromFormat('F', $quota->month)->month))->first();

            DB::table('bucket_defaults')->insert([
                'bucket_id' => $bucketId,
                'effective_month' => now()->addMonthNoOverflow()->startOfMonth()->toDateString(),
                'amount' => $nonFuture?->amount,
            ]);
            $bucketIds[$quotaName] = $bucketId;
        }

        DB::table('records')
            ->whereNotNull('quota_id')
            ->orderBy('id')
            ->each(function ($record) use ($quotaBucketIds) {
                $bucketId = $quotaBucketIds[$record->quota_id] ?? null;
                DB::table('records')->where('id', $record->id)->update([
                    'bucket_id' => $bucketId,
                    'bucket_source' => 'manual',
                ]);
            });

        $income = ['salary', 'interest'];
        $saving = ['investments'];
        $neutral = ['transfer', 'claim'];
        $automatic = ['gift', 'classes'];

        foreach (DB::table('categories')->get() as $category) {
            $treatment = match (true) {
                in_array($category->id, $income, true) => 'income',
                in_array($category->id, $saving, true) => 'saving_investment',
                in_array($category->id, $neutral, true) => 'neutral',
                in_array($category->id, $automatic, true) => 'automatic',
                default => 'spending',
            };

            DB::table('categories')->where('id', $category->id)->update([
                'analytics_treatment' => $treatment,
            ]);

            DB::table('records')->where('category_id', $category->id)->update([
                'analytics_treatment' => $treatment,
                'analytics_treatment_source' => 'category',
            ]);
        }

        DB::table('records')
            ->whereNotNull('bucket_id')
            ->where(function ($query) {
                $query->whereNot('analytics_treatment', 'spending')
                    ->where(function ($query) {
                        $query->whereNot('analytics_treatment', 'automatic')
                            ->orWhere('amount', '>=', 0);
                    });
            })
            ->update([
                'bucket_id' => null,
                'bucket_source' => null,
            ]);
    }

    private function dropLegacyQuotaSchema(): void
    {
        Schema::table('records', function (Blueprint $table) {
            $table->dropForeign(['quota_id']);
            $table->dropColumn('quota_id');
        });

        Schema::drop('quotas');
    }

    public function down(): void
    {
        throw new RuntimeException('Restore the pre-migration database copy to reverse this one-time data conversion.');
    }
};
