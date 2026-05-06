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
        Schema::create('allocations', function (Blueprint $table) {
            $table->string('source_statement_id')->references('id')->on('statements')->nullable()->constrained();
            $table->string('source_record_id')->references('id')->on('records')->nullable()->constrained();
            $table->string('target_record_id')->references('id')->on('records')->constrained();
            $table->decimal('amount');
            $table->primary(['source_statement_id', 'source_record_id', 'target_record_id']);
        });

        DB::statement(<<<'EOF'
            ALTER TABLE allocations
            ADD COLUMN source_check
            CHECK (
                (source_statement_id IS NOT NULL AND source_record_id IS NULL) OR
                (source_statement_id IS NULL AND source_record_id IS NOT NULL)
            );
        EOF);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allocations');
    }
};
