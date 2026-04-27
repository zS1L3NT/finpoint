<?php

use App\Models\Account;
use App\Models\Statement;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add 'bank' column to accounts table, with the old value of 'DBS' for existing records, and make it non-nullable
        Schema::table('accounts', function (Blueprint $table) {
            $table->string('bank')->after('balance')->nullable();
        });

        foreach (Account::all() as $account) {
            $account->update(['bank' => 'DBS']);
        }

        Schema::table('accounts', function (Blueprint $table) {
            $table->string('bank')->change();
        });

        // Remove dashes from account IDs and update foreign key constraints in statements table
        Schema::table('statements', function (Blueprint $table) {
            $table->foreignIdFor(Account::class)->change()->constrained()->cascadeOnUpdate();
        });

        foreach (Account::all() as $account) {
            $account->update(['id' => Str::replace('-', '', $account->id)]);
        }

        Schema::table('statements', function (Blueprint $table) {
            $table->foreignIdFor(Account::class)->change()->constrained();
        });

        // Add unique constraint to statements table to prevent duplicate entries
        Schema::table('statements', function (Blueprint $table) {
            $table->unique(['account_id', 'date', 'description', 'amount'], 'unique_statement');
        });

        // Remove time component from date field in statements table
        foreach (Statement::all() as $statement) {
            $statement->update(['date' => Carbon::parse($statement->date)->startOfDay()]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->dropColumn('bank');
        });

        Schema::table('statements', function (Blueprint $table) {
            $table->dropUnique('unique_statement');
        });
    }
};
