from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_jwt.settings import api_settings
from .models import Inbound, User, Certificate
from .validators import CertificateValidators

JWT_PAYLOAD_HANDLER = api_settings.JWT_PAYLOAD_HANDLER
JWT_ENCODE_HANDLER = api_settings.JWT_ENCODE_HANDLER


class UserTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        return data


class InboundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbound
        fields = ['id', 'name', 'enable', 'sniffing',
                  'protocol', 'protocol_setting', 'transport', 'bindip',
                  'port', 'up', 'down', "total",
                  'expire', 'certificate', 'behind_nginx']


class InboundStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbound
        fields = ["id", 'enable']


class CertificateSerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        CertificateValidators.is_valid_private_key_format(attrs['privatekey'])
        CertificateValidators.is_valid_private_key(attrs['privatekey'])
        CertificateValidators.is_valid_certificate_format(attrs['certificate'])
        CertificateValidators.is_valid_certificate(attrs['certificate'])
        CertificateValidators.private_key_and_certificate_matches(attrs['privatekey'], attrs['certificate'])
        return attrs

    class Meta:
        model = Certificate
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['password']
        extra_kwargs = {
            'password':
                {'write_only': True,
                 'required': True,
                 },
        }
