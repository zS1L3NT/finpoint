<?php

use App\Models\Budget;
use App\Models\Record;
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
        Schema::create("budget_records", function (Blueprint $table) {
            $table->foreignIdFor(Budget::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Record::class)->constrained()->cascadeOnDelete();
            $table->primary(["budget_id", "record_id"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("budget_records");
    }
};
