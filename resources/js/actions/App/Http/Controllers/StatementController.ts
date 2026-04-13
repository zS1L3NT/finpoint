import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\StatementController::index
* @see app/Http/Controllers/StatementController.php:10
* @route '/statements'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/statements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StatementController::index
* @see app/Http/Controllers/StatementController.php:10
* @route '/statements'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StatementController::index
* @see app/Http/Controllers/StatementController.php:10
* @route '/statements'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StatementController::index
* @see app/Http/Controllers/StatementController.php:10
* @route '/statements'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\StatementController::index
* @see app/Http/Controllers/StatementController.php:10
* @route '/statements'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StatementController::index
* @see app/Http/Controllers/StatementController.php:10
* @route '/statements'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StatementController::index
* @see app/Http/Controllers/StatementController.php:10
* @route '/statements'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const StatementController = { index }

export default StatementController