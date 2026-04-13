import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ImportController::index
* @see app/Http/Controllers/ImportController.php:14
* @route '/import'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/import',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImportController::index
* @see app/Http/Controllers/ImportController.php:14
* @route '/import'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImportController::index
* @see app/Http/Controllers/ImportController.php:14
* @route '/import'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ImportController::index
* @see app/Http/Controllers/ImportController.php:14
* @route '/import'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ImportController::index
* @see app/Http/Controllers/ImportController.php:14
* @route '/import'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ImportController::index
* @see app/Http/Controllers/ImportController.php:14
* @route '/import'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ImportController::index
* @see app/Http/Controllers/ImportController.php:14
* @route '/import'
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

/**
* @see \App\Http\Controllers\ImportController::store
* @see app/Http/Controllers/ImportController.php:19
* @route '/import'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImportController::store
* @see app/Http/Controllers/ImportController.php:19
* @route '/import'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImportController::store
* @see app/Http/Controllers/ImportController.php:19
* @route '/import'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImportController::store
* @see app/Http/Controllers/ImportController.php:19
* @route '/import'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImportController::store
* @see app/Http/Controllers/ImportController.php:19
* @route '/import'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const ImportController = { index, store }

export default ImportController