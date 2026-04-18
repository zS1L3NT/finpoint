<?php

use App\Http\Controllers\Api\BudgetRecordController;
use App\Http\Controllers\Api\RecordController;
use Illuminate\Support\Facades\Route;

Route::apiResource("records", RecordController::class)->only("index");

Route::apiResource("budgets.records", BudgetRecordController::class)->only("store", "destroy");