<?php

use App\Http\Controllers\AllocatorController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImporterController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\RecurrenceController;
use App\Http\Controllers\StatementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::resource("importer", ImporterController::class)->only("index")->names([
    "index" => "importer"
]);

Route::resource("allocator", AllocatorController::class)->only("index")->names([
    "index" => "allocator"
]);

Route::resource("statements", StatementController::class)->only("index", "show")->names([
    "index" => "statements",
    "show" => "statement"
]);

Route::resource("records", RecordController::class)->only("index", "show")->names([
    "index" => "records",
    "show" => "record"
]);

Route::resource("budgets", BudgetController::class)->only("index", "show")->names([
    "index" => "budgets",
    "show" => "budget"
]);

Route::resource("recurrences", RecurrenceController::class)->only("index", "show")->names([
    "index" => "recurrences",
    "show" => "recurrence"
]);

Route::resource("categories", CategoryController::class)->only("index")->names([
    "index" => "categories"
]);

// Route::redirect("/", "/importer");

Route::get("/", function () {
    return Inertia::render("welcome");
});