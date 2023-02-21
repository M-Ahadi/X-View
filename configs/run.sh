#! /usr/bin/env sh
set -e

sed -i "s/NGINX_PORT/${NGINX_PORT}/" /etc/nginx/nginx.conf
python manage.py migrate
python manage.py initialize_data
python manage.py load_configs

export SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf