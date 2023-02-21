from django.urls import path, include

from rest_framework import routers

from .views import TelegramView

router = routers.DefaultRouter()
router.register('telegram', TelegramView)

app_name = 'telegram_app'
urlpatterns = [

    path('api/', include(router.urls)),
]
