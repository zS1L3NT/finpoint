<?php

use App\Models\Quota;
use App\Models\Record;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('record_quota', function (Blueprint $table) {
            $table->foreignIdFor(Record::class)->primary()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Quota::class)->nullable()->constrained()->nullOnDelete();
        });

        foreach (Record::all() as $record) {
            $record->quota_pivot()->create();
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
