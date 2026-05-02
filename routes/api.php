<?php

use App\Http\Controllers\Api\AllocatorController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\BudgetRecordController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ImporterController;
use App\Http\Controllers\Api\QuotaController;
use App\Http\Controllers\Api\RecordController;
use App\Http\Controllers\Api\RecordQuotaController;
use App\Http\Controllers\Api\RecurrenceController;
use App\Http\Controllers\Api\RecurrenceRecordController;
use Illuminate\Support\Facades\Route;

Route::post('importer/dbs', [ImporterController::class, 'dbs'])->name('importer-dbs-api-route');
Route::post('importer/uob', [ImporterController::class, 'uob'])->name('importer-uob-api-route');
Route::post('importer/revolut', [ImporterController::class, 'revolut'])->name('importer-revolut-api-route');

Route::post('allocator', AllocatorController::class)->name('allocator-api-route');

Route::apiResource('records', RecordController::class)
    ->only('index', 'store', 'update', 'destroy')
    ->names([
        'index' => 'record-index-api-route',
        'update' => 'record-update-api-route',
        'destroy' => 'record-destroy-api-route',
    ]);

Route::post('records/{record}/quotas/{quota}', [RecordQuotaController::class, 'attach'])->name('record-quota-attach-api-route');
Route::delete('records/{record}/quotas/{quota}', [RecordQuotaController::class, 'detach'])->name('record-quota-detach-api-route');

Route::apiResource('budgets', BudgetController::class)
    ->only('store', 'update', 'destroy')
    ->names([
        'store' => 'budget-store-api-route',
        'update' => 'budget-update-api-route',
        'destroy' => 'budget-destroy-api-route'
    ]);

Route::post('budgets/{budget}/records/{record}', [BudgetRecordController::class, 'attach'])->name('budget-record-attach-api-route');
Route::delete('budgets/{budget}/records/{record}', [BudgetRecordController::class, 'detach'])->name('budget-record-detach-api-route');

Route::apiResource('recurrences', RecurrenceController::class)
    ->only('store', 'update', 'destroy')
    ->names([
        'store' => 'recurrence-store-api-route',
        'update' => 'recurrence-update-api-route',
        'destroy' => 'recurrence-destroy-api-route'
    ]);

Route::post('recurrences/{recurrence}/records/{record}', [RecurrenceRecordController::class, 'attach'])->name('recurrence-record-attach-api-route');
Route::delete('recurrences/{recurrence}/records/{record}', [RecurrenceRecordController::class, 'detach'])->name('recurrence-record-detach-api-route');

Route::apiResource('categories', CategoryController::class)
    ->only('store', 'update', 'destroy')
    ->names([
        'store' => 'category-store-api-route',
        'update' => 'category-update-api-route',
        'destroy' => 'category-destroy-api-route'
    ]);

Route::apiResource('quotas', QuotaController::class)
    ->only('store', 'update', 'destroy')
    ->names([
        'store' => 'quota-store-api-route',
        'update' => 'quota-update-api-route',
        'destroy' => 'quota-destroy-api-route'
    ]);