<?php

use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\BudgetRecordController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ImporterController;
use App\Http\Controllers\Api\RecordController;
use App\Http\Controllers\Api\RecurrenceController;
use App\Http\Controllers\Api\RecurrenceRecordController;
use Illuminate\Support\Facades\Route;

Route::apiResource('importer', ImporterController::class)
    ->only('store')
    ->names([
        'store' => 'importer-api-route',
    ]);

Route::apiResource('records', RecordController::class)
    ->only('index', 'store', 'update', 'destroy')
    ->names([
        'index' => 'record-index-api-route',
        'store' => 'record-store-api-route',
        'update' => 'record-update-api-route',
        'destroy' => 'record-destroy-api-route',
    ]);

Route::apiResource('budgets', BudgetController::class)
    ->only('store', 'update', 'destroy')
    ->names([
        'store' => 'budget-store-api-route',
        'update' => 'budget-update-api-route',
        'destroy' => 'budget-destroy-api-route'
    ]);

Route::apiResource('budgets.records', BudgetRecordController::class)
    ->only('update', 'destroy')
    ->names([
        'update' => 'budget-record-update-api-route',
        'destroy' => 'budget-record-destroy-api-route'
    ]);

Route::apiResource('recurrences', RecurrenceController::class)
    ->only('store', 'update', 'destroy')
    ->names([
        'store' => 'recurrence-store-api-route',
        'update' => 'recurrence-update-api-route',
        'destroy' => 'recurrence-destroy-api-route'
    ]);

Route::apiResource('recurrences.records', RecurrenceRecordController::class)
    ->only('update', 'destroy')
    ->names([
        'update' => 'recurrence-record-update-api-route',
        'destroy' => 'recurrence-record-destroy-api-route'
    ]);

Route::apiResource('categories', CategoryController::class)
    ->only('store', 'update', 'destroy')
    ->names([
        'store' => 'category-store-api-route',
        'update' => 'category-update-api-route',
        'destroy' => 'category-destroy-api-route'
    ]);
