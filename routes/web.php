<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\StatementController;
use Illuminate\Support\Facades\Route;

Route::resource("import", ImportController::class)->only("index", "store");

Route::resource("statements", StatementController::class)->only("index");

Route::resource("records", RecordController::class);

Route::resource("categories", CategoryController::class)->only("index", "store", "update", "destroy");

Route::redirect("/", "/records");