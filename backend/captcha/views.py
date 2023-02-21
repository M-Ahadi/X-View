# Create your views here.
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Captcha
from .serializers import CaptchaSerializer, CaptchaSiteKeySerializer


class CaptchaView(viewsets.ModelViewSet):
    http_method_names = ["post", "get"]
    serializer_class = CaptchaSerializer
    queryset = Captcha.objects.all()
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        captcha = self.queryset.first()
        if captcha:
            captcha.enable = serializer.validated_data.get("enable")
            captcha.secret_key = serializer.validated_data.get("secret_key")
            captcha.site_key = serializer.validated_data.get("site_key")
            captcha.save()
        else:
            self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CaptchaSiteKyeView(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = CaptchaSiteKeySerializer
    queryset = Captcha.objects.filter(enable=True).all()
