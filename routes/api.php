<?php

use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\BudgetRecordController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ImporterController;
use App\Http\Controllers\Api\RecordController;
use Illuminate\Support\Facades\Route;

Route::apiResource("importer", ImporterController::class)->only("store");

Route::apiResource("records", RecordController::class)->only("index", "store", "update", "destroy");

Route::apiResource("budgets", BudgetController::class)->only("store", "update", "destroy");

Route::apiResource("budgets.records", BudgetRecordController::class)->only("update", "destroy");

Route::apiResource("categories", CategoryController::class)->only("store", "update", "destroy");