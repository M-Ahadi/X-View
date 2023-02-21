from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from .models import Captcha

JWT_PAYLOAD_HANDLER = api_settings.JWT_PAYLOAD_HANDLER
JWT_ENCODE_HANDLER = api_settings.JWT_ENCODE_HANDLER


class CaptchaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Captcha
        fields = "__all__"


class CaptchaSiteKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = Captcha
        fields = ['site_key']