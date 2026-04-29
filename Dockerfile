FROM bitnami/laravel

WORKDIR /app

COPY . /app

ENV APP_NAME=Finpoint \
	APP_ENV=local \
	APP_DEBUG=true \
	APP_URL=http://localhost:8000 \
	DB_CONNECTION=sqlite \
	DB_DATABASE=/app/database/database.sqlite \
	SESSION_DRIVER=file \
	CACHE_STORE=file \
	QUEUE_CONNECTION=sync

RUN cp .env.example .env \
	&& composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader \
	&& php artisan key:generate \
	&& php artisan wayfinder:generate --path=resources/js/wayfinder --skip-actions \
	&& npm install \
	&& npm run build \
	&& chmod -R g+w storage bootstrap/cache \
	&& chmod +x docker/start.sh

EXPOSE 8000

CMD [ "./docker/start.sh" ]
