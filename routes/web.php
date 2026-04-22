<?php

use App\Http\Controllers\AllocatorController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImporterController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\RecurrenceController;
use App\Http\Controllers\StatementController;
use Illuminate\Support\Facades\Route;

Route::resource('importer', ImporterController::class)
    ->only('index')
    ->names([
        'index' => 'importer-web-route',
    ]);

Route::resource('allocator', AllocatorController::class)
    ->only('index')
    ->names([
        'index' => 'allocator-web-route',
    ]);

Route::resource('statements', StatementController::class)
    ->only('index', 'show')
    ->names([
        'index' => 'statements-web-route',
        'show' => 'statement-web-route',
    ]);

Route::resource('records', RecordController::class)
    ->only('index', 'show')
    ->names([
        'index' => 'records-web-route',
        'show' => 'record-web-route',
    ]);

Route::resource('budgets', BudgetController::class)
    ->only('index', 'show')
    ->names([
        'index' => 'budgets-web-route',
        'show' => 'budget-web-route',
    ]);

Route::resource('recurrences', RecurrenceController::class)
    ->only('index', 'show')
    ->names([
        'index' => 'recurrences-web-route',
        'show' => 'recurrence-web-route',
    ]);

Route::resource('categories', CategoryController::class)
    ->only('index')
    ->names([
        'index' => 'categories-web-route',
    ]);

Route::get('/', DashboardController::class)
    ->name('dashboard-web-route');
