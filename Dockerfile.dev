FROM php:8.3-apache

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

RUN apt update && apt install -y libxml2-dev zlib1g-dev libpng-dev

RUN a2enmod rewrite

RUN docker-php-ext-install mysqli dom intl simplexml session xml gd pdo pdo_mysql

COPY --chown=www-data:www-data . /var/www/html

EXPOSE 80
