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
        Schema::create('recurrence_records', function (Blueprint $table) {
            $table->string('recurrence_id')->references('id')->on('recurrences')->constrained()->cascadeOnDelete();
            $table->string('record_id')->references('id')->on('records')->constrained()->cascadeOnDelete();
            $table->primary(['recurrence_id', 'record_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recurrence_records');
    }
};
