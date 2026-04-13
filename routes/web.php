<?php

use App\Http\Controllers\ImportController;
use Illuminate\Support\Facades\Route;

Route::resource("import", ImportController::class)->only("index", "store");
