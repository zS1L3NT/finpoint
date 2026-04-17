<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <link rel="stylesheet" href="{{ asset('bootstrap.min.css')  }}">
    <script defer src="{{ asset('bootstrap.bundle.min.js')  }}"></script>

    @viteReactRefresh
    @vite(["resources/css/app.css", "resources/js/app.tsx", "resources/js/pages/{$page["component"]}.tsx"])
    <x-inertia::head>
        <title>{{ config("app.name", "Laravel") }}</title>
    </x-inertia::head>
</head>

<body>
    <x-inertia::app />
</body>

</html>