<?php

use App\Models\Record;
use App\Models\Recurrence;
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
        Schema::dropIfExists('recurrence_records');
        Schema::dropIfExists('recurrences');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('recurrences', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->double('amount');
            $table->enum('period', ['month', 'year']);
        });

        Schema::create('recurrence_records', function (Blueprint $table) {
            $table->foreignIdFor(Recurrence::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Record::class)->constrained()->cascadeOnDelete();
            $table->primary(['recurrence_id', 'record_id']);
        });
    }
};
