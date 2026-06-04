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
            $table->string('recurrence_id')->references('id')->on('recurrences')->constrained()->cascadeOnDelete();
            $table->string('record_id')->references('id')->on('records')->constrained()->cascadeOnDelete();
            $table->primary(['recurrence_id', 'record_id']);
        });
    }
};
