<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <link rel="stylesheet" href="{{ asset('bootstrap.min.css')  }}">
    <script defer src="{{ asset('bootstrap.bundle.min.js')  }}"></script>
    @routes
    @inertiaHead
    @vite("resources/js/app.js")
</head>

<body>
    @inertia
</body>

</html>