<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add 'bank' column to accounts table, with the old value of 'DBS' for existing records, and make it non-nullable
        Schema::table('accounts', function (Blueprint $table) {
            $table->string('bank')->after('balance')->nullable();
        });

        foreach (DB::table('accounts')->get() as $account) {
            DB::table('accounts')->where('id', $account->id)->update(['bank' => 'DBS']);
        }

        Schema::table('accounts', function (Blueprint $table) {
            $table->string('bank')->after('balance')->nullable(false)->change();
        });

        // Remove dashes from account IDs and update foreign key constraints in statements table
        Schema::table('statements', function (Blueprint $table) {
            $table->string('account_id')->change()->cascadeOnUpdate();
        });

        foreach (DB::table('accounts')->get() as $account) {
            DB::table('accounts')->where('id', $account->id)->update(['id' => Str::replace('-', '', $account->id)]);
        }

        Schema::table('statements', function (Blueprint $table) {
            $table->string('account_id')->change()->cascadeOnUpdate(false);
        });

        // Add unique constraint to statements table to prevent duplicate entries
        Schema::table('statements', function (Blueprint $table) {
            $table->unique(['account_id', 'date', 'description', 'amount'], 'unique_statement');
        });

        // Remove time component from date field in statements table
        foreach (DB::table('statements')->get() as $statement) {
            DB::table('statements')->where('id', $statement->id)->update(['date' => Carbon::parse($statement->date)->startOfDay()]);
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
