import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RecordController::index
* @see app/Http/Controllers/RecordController.php:13
* @route '/records'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/records',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecordController::index
* @see app/Http/Controllers/RecordController.php:13
* @route '/records'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecordController::index
* @see app/Http/Controllers/RecordController.php:13
* @route '/records'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecordController::index
* @see app/Http/Controllers/RecordController.php:13
* @route '/records'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecordController::index
* @see app/Http/Controllers/RecordController.php:13
* @route '/records'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecordController::index
* @see app/Http/Controllers/RecordController.php:13
* @route '/records'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecordController::index
* @see app/Http/Controllers/RecordController.php:13
* @route '/records'
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
* @see \App\Http\Controllers\RecordController::create
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/records/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecordController::create
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecordController::create
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecordController::create
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecordController::create
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecordController::create
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecordController::create
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\RecordController::store
* @see app/Http/Controllers/RecordController.php:19
* @route '/records'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/records',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RecordController::store
* @see app/Http/Controllers/RecordController.php:19
* @route '/records'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecordController::store
* @see app/Http/Controllers/RecordController.php:19
* @route '/records'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecordController::store
* @see app/Http/Controllers/RecordController.php:19
* @route '/records'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecordController::store
* @see app/Http/Controllers/RecordController.php:19
* @route '/records'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\RecordController::show
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
export const show = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/records/{record}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecordController::show
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
show.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { record: args }
    }

    if (Array.isArray(args)) {
        args = {
            record: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        record: args.record,
    }

    return show.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecordController::show
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
show.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecordController::show
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
show.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecordController::show
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
const showForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecordController::show
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
showForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecordController::show
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
showForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\RecordController::edit
* @see app/Http/Controllers/RecordController.php:53
* @route '/records/{record}/edit'
*/
export const edit = (args: { record: string | { id: string } } | [record: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/records/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecordController::edit
* @see app/Http/Controllers/RecordController.php:53
* @route '/records/{record}/edit'
*/
edit.url = (args: { record: string | { id: string } } | [record: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { record: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { record: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            record: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        record: typeof args.record === 'object'
        ? args.record.id
        : args.record,
    }

    return edit.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecordController::edit
* @see app/Http/Controllers/RecordController.php:53
* @route '/records/{record}/edit'
*/
edit.get = (args: { record: string | { id: string } } | [record: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecordController::edit
* @see app/Http/Controllers/RecordController.php:53
* @route '/records/{record}/edit'
*/
edit.head = (args: { record: string | { id: string } } | [record: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecordController::edit
* @see app/Http/Controllers/RecordController.php:53
* @route '/records/{record}/edit'
*/
const editForm = (args: { record: string | { id: string } } | [record: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecordController::edit
* @see app/Http/Controllers/RecordController.php:53
* @route '/records/{record}/edit'
*/
editForm.get = (args: { record: string | { id: string } } | [record: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecordController::edit
* @see app/Http/Controllers/RecordController.php:53
* @route '/records/{record}/edit'
*/
editForm.head = (args: { record: string | { id: string } } | [record: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\RecordController::update
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
export const update = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/records/{record}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\RecordController::update
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
update.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { record: args }
    }

    if (Array.isArray(args)) {
        args = {
            record: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        record: args.record,
    }

    return update.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecordController::update
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
update.put = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\RecordController::update
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
update.patch = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\RecordController::update
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
const updateForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecordController::update
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
updateForm.put = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecordController::update
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
updateForm.patch = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\RecordController::destroy
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
export const destroy = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/records/{record}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RecordController::destroy
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
destroy.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { record: args }
    }

    if (Array.isArray(args)) {
        args = {
            record: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        record: args.record,
    }

    return destroy.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecordController::destroy
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
destroy.delete = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\RecordController::destroy
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
const destroyForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecordController::destroy
* @see app/Http/Controllers/RecordController.php:0
* @route '/records/{record}'
*/
destroyForm.delete = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const RecordController = { index, create, store, show, edit, update, destroy }

export default RecordController