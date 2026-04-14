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
            $table->text("id")->primary();
            $table->text("date");
            $table->foreignIdFor(Category::class)->constrained();
            $table->decimal("amount");
            $table->text("description");
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
