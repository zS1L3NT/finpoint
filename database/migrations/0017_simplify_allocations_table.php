<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('allocations', function (Blueprint $table) {
            $table->dropPrimary();

            $table->dropForeign(['source_record_id']);
            $table->dropColumn('source_record_id');

            $table->dropForeign(['source_statement_id']);
            $table->renameColumn('source_statement_id', 'statement_id');
            $table->foreign('statement_id')->references('id')->on('statements')->constrained();

            $table->dropForeign(['target_record_id']);
            $table->renameColumn('target_record_id', 'record_id');
            $table->foreign('record_id')->references('id')->on('records')->constrained()->cascadeOnDelete();

            $table->primary(['statement_id', 'record_id']);

            $table->dropColumn('source_check');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('allocations', function (Blueprint $table) {
            $table->dropPrimary();

            $table->string('source_record_id')->nullable()->references('id')->on('records')->constrained()->after('source_statement_id');

            $table->dropForeign(['statement_id']);
            $table->renameColumn('statement_id', 'source_statement_id');
            $table->foreign('source_statement_id')->references('id')->on('statements')->nullable()->constrained();

            $table->dropForeign(['record_id']);
            $table->renameColumn('record_id', 'target_record_id');
            $table->foreign('target_record_id')->references('id')->on('records')->constrained();

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
};
