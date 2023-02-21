from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from .models import Telegram

JWT_PAYLOAD_HANDLER = api_settings.JWT_PAYLOAD_HANDLER
JWT_ENCODE_HANDLER = api_settings.JWT_ENCODE_HANDLER


class TelegramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telegram
        fields = "__all__"
