<?php

use App\Models\Category;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("records", function (Blueprint $table) {
            $table->string("id")->primary();
            $table->string("title");
            $table->string("people")->nullable();
            $table->string("location")->nullable();
            $table->string("description")->nullable();
            $table->timestamp("datetime");
            $table->decimal("amount");
            $table->foreignIdFor(Category::class)->constrained()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("records");
    }
};
