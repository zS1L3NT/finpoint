<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('records', function (Blueprint $table) {
            $table->string('quota_id')->references('id')->on('quotas')->nullable()->constrained()->nullOnDelete();
        });

        foreach (DB::table('records')->get() as $record) {
            DB::table('records')->where('id', $record->id)->update([
                'quota_id' => DB::table('record_quota')->where('record_id', $record->id)->firstOrFail()->quota_id,
            ]);
        }

        Schema::drop('record_quota');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('record_quota', function (Blueprint $table) {
            $table->string('record_id')->references('id')->on('records')->primary()->constrained()->cascadeOnDelete();
            $table->string('quota_id')->references('id')->on('quotas')->nullable()->constrained()->nullOnDelete();
        });

        foreach (DB::table('records')->get() as $record) {
            DB::table('record_quota')->insert([
                'record_id' => $record->id,
                'quota_id' => $record->quota_id,
            ]);
        }

        Schema::table('records', function (Blueprint $table) {
            $table->dropForeign(['quota_id']);
            $table->dropColumn('quota_id');
        });
    }
};
