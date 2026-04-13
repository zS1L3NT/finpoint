<?php

use App\Models\Account;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("statements", function (Blueprint $table) {
            $table->foreignIdFor(Account::class)->constrained();
            $table->text("id")->primary();
            $table->text("transaction_date");
            $table->text("value_date");
            $table->text("statement_code");
            $table->text("description");
            $table->text("supplementary_code");
            $table->text("supplementary_code_description");
            $table->text("client_reference");
            $table->text("additional_reference");
            $table->text("status");
            $table->text("currency");
            $table->decimal("debit_amount")->nullable();
            $table->decimal("credit_amount")->nullable();
            $table->decimal("amount")->virtualAs("- COALESCE(debit_amount, 0) + COALESCE(credit_amount, 0)");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("statements");
    }
};
