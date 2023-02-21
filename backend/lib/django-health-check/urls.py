from django.urls import include, path
from .views import AllInOneHealthCheck

urlpatterns = [
  path('', include('health_check.urls')),
  path('all-in-one', AllInOneHealthCheck.as_view())
]