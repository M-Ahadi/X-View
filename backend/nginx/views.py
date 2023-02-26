from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated

from .models import Nginx
from .serializers import NginxSerializer
from rest_framework.response import Response


class NginxView(viewsets.ModelViewSet):
    http_method_names = ["post", "get"]
    serializer_class = NginxSerializer
    queryset = Nginx.objects.all()
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        nginx = self.queryset.first()
        if nginx:
            nginx.certificate_id = serializer.validated_data.get("certificate")
            nginx.domain = serializer.validated_data.get("domain")
            nginx.enable = serializer.validated_data.get("enable")
            nginx.save()
        else:
            self.perform_create(serializer)
        Nginx.restart_nginx()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)