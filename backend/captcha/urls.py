from django.urls import path, include

from rest_framework import routers

from .views import CaptchaView, CaptchaSiteKyeView

router = routers.DefaultRouter()
router.register('captcha', CaptchaView)
router.register('sitekey', CaptchaSiteKyeView)

app_name = 'captcha_app'
urlpatterns = [

    path('api/', include(router.urls)),
]
