<?php

use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\BucketController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\BudgetRecordController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CompletionsController;
use App\Http\Controllers\Api\ImporterController;
use App\Http\Controllers\Api\RecordBucketController;
use App\Http\Controllers\Api\RecordController;
use App\Http\Controllers\Api\StatementController;
use Illuminate\Support\Facades\Route;

Route::post('importer/dbs', [ImporterController::class, 'dbs'])->name('importer-dbs-api-route');
Route::post('importer/uob', [ImporterController::class, 'uob'])->name('importer-uob-api-route');
Route::post('importer/revolut', [ImporterController::class, 'revolut'])->name('importer-revolut-api-route');

Route::get('completions/records', [CompletionsController::class, 'records'])->name('completions-records-api-route');

Route::apiResource('statements', StatementController::class)
    ->only('index', 'store', 'update', 'destroy')
    ->names([
        'index' => 'statement-index-api-route',
        'store' => 'statement-store-api-route',
        'update' => 'statement-update-api-route',
        'destroy' => 'statement-destroy-api-route',
    ]);
Route::post('statements/{statement}/replace-pending/{pending_statement}', [StatementController::class, 'replacePending'])
    ->name('statement-replace-pending-api-route');

Route::apiResource('accounts', AccountController::class)
    ->only('update')
    ->names([
        'update' => 'account-update-api-route',
    ]);

Route::patch('records/bucket', [RecordBucketController::class, 'update'])->name('record-bucket-update-api-route');

Route::apiResource('records', RecordController::class)
    ->names([
        'index' => 'record-index-api-route',
        'store' => 'record-store-api-route',
        'show' => 'record-show-api-route',
        'update' => 'record-update-api-route',
        'destroy' => 'record-destroy-api-route',
    ]);

Route::apiResource('buckets', BucketController::class)
    ->only('index', 'store', 'update')
    ->names([
        'index' => 'bucket-index-api-route',
        'store' => 'bucket-store-api-route',
        'update' => 'bucket-update-api-route',
    ]);
Route::put('buckets/{bucket}/target', [BucketController::class, 'target'])->name('bucket-target-update-api-route');

Route::apiResource('budgets', BudgetController::class)
    ->only('store', 'update', 'destroy')
    ->names([
        'store' => 'budget-store-api-route',
        'update' => 'budget-update-api-route',
        'destroy' => 'budget-destroy-api-route',
    ]);

Route::post('budgets/{budget}/records/{record}', [BudgetRecordController::class, 'attach'])->name('budget-record-attach-api-route');
Route::delete('budgets/{budget}/records/{record}', [BudgetRecordController::class, 'detach'])->name('budget-record-detach-api-route');

Route::apiResource('categories', CategoryController::class)
    ->only('index', 'store', 'update', 'destroy')
    ->names([
        'index' => 'category-index-api-route',
        'store' => 'category-store-api-route',
        'update' => 'category-update-api-route',
        'destroy' => 'category-destroy-api-route',
    ]);
