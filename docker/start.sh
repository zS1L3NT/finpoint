#!/bin/sh
set -eu

[ -f /app/database/database.sqlite ] || touch /app/database/database.sqlite

php artisan migrate --force
exec php artisan serve --host=0.0.0.0 --port=8000
