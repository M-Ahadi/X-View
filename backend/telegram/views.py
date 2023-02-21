# Create your views here.
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Telegram
from .serializers import TelegramSerializer


class TelegramView(viewsets.ModelViewSet):
    http_method_names = ["post", "get"]
    serializer_class = TelegramSerializer
    queryset = Telegram.objects.all()
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        telegram = self.queryset.first()
        if telegram:
            telegram.token = serializer.validated_data.get("token")
            telegram.chatid = serializer.validated_data.get("chatid")
            telegram.enable = serializer.validated_data.get("enable")
            telegram.save()
        else:
            self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
