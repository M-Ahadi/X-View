from rest_framework import serializers
from .models import Nginx


class NginxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nginx
        fields = "__all__"
