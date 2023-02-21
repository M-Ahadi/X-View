curl -f http://localhost:8000/ht/all-in-one?format=json || exit 1
curl -fs http://localhost:$NGINX_PORT/ || curl -fs https://localhost:$NGINX_PORT/ || exit 1
