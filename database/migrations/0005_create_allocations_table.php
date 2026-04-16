<?php

use App\Models\Record;
use App\Models\Statement;
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
        Schema::create("allocations", function (Blueprint $table) {
            $table->foreignIdFor(Statement::class, "source_statement_id")->nullable()->constrained();
            $table->foreignIdFor(Record::class, "source_record_id")->nullable()->constrained();
            $table->foreignIdFor(Record::class, "target_record_id")->constrained();
            $table->decimal("amount");
            $table->primary(["source_statement_id", "source_record_id", "target_record_id"]);
        });

        DB::statement(<<<EOF
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
        Schema::dropIfExists("allocations");
    }
};
