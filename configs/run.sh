#! /usr/bin/env sh
set -e

export SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')

python manage.py migrate
python manage.py initialize_data
python manage.py make_nginx_server
python manage.py load_configs

exec "$@"