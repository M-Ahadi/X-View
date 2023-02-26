from django.urls import path, include

from rest_framework import routers

from .views import NginxView

router = routers.DefaultRouter()
router.register('nginx', NginxView)

app_name = 'nginx_app'
urlpatterns = [

    path('api/', include(router.urls)),
]
