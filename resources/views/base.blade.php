<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fintrack - @yield('title')</title>
    <link rel="stylesheet" href="{{ asset('bootstrap.min.css')  }}">
    <script defer src="{{ asset('bootstrap.bundle.min.js')  }}"></script>
</head>

<body class="d-flex flex-column">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="">Administrator Portal</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('import.index') }}">Import</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('statements.index') }}">Statements</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <main class="container flex-grow-1 mt-5 @yield('class')">
        @yield('main')
    </main>

    <footer>
        <p class="text-center py-3">Copyright &copy; Zechariah Tan</p>
    </footer>
</body>

</html>