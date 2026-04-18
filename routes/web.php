<?php

use App\Http\Controllers\AllocatorController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImporterController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\StatementController;
use Illuminate\Support\Facades\Route;

Route::resource("importer", ImporterController::class)->only("index", "store");

Route::resource("allocator", AllocatorController::class)->only("index");

Route::resource("statements", StatementController::class)->only("index", "show");

Route::resource("records", RecordController::class)->only("index", "store", "show", "update", "destroy");

Route::resource("budgets", BudgetController::class)->only("index", "store", "show", "update", "destroy");

Route::resource("categories", CategoryController::class)->only("index", "store", "update", "destroy");

Route::redirect("/", "/importer");