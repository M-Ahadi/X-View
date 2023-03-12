from django.urls import path, include

from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views

from .views import InboundViewSet, UserTokenObtainPairView, InboundStatusView, CertificateView, UserViewSet, \
    GenerateKeyView

router = routers.DefaultRouter()
router.register('inbounds', InboundViewSet)
router.register('status', InboundStatusView)
router.register('certificate', CertificateView)
router.register('change_password', UserViewSet)

app_name = 'xview_app'
urlpatterns = [
    path('api/', include(router.urls)),
    path('api/generate_password/<int:key_length>/', GenerateKeyView.as_view()),
    path('api/login/', UserTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]
