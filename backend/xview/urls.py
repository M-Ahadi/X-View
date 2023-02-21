from django.urls import path, include

from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views

from .views import InboundViewSet, UserTokenObtainPairView, InboundStatusView, CertificateView, UserViewSet

router = routers.DefaultRouter()
router.register('inbounds', InboundViewSet)
router.register('status', InboundStatusView)
router.register('certificate', CertificateView)
router.register('change_password', UserViewSet)


app_name = 'xview_app'
urlpatterns = [

    path('api/',include(router.urls)),
    # path('api/login/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/', UserTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    # url(r'^login_urls$',views.get_login_urls,name='get_login_urls'),
]
