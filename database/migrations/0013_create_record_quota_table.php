<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('record_quota');
    }
};
