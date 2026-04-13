<?php

use App\Http\Controllers\ImportController;
use App\Http\Controllers\StatementController;
use Illuminate\Support\Facades\Route;

Route::resource("import", ImportController::class)->only("index", "store");

Route::resource("statements", StatementController::class)->only("index");

Route::redirect("/", "/statements");