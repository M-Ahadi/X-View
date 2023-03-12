import logging
import subprocess
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, filters
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from captcha.models import Captcha
from .models import Inbound, Certificate, User
from .pagination import InboundPagination
from .permissions import UpdateOwnProfile
from .serializers import InboundSerializer, UserTokenObtainPairSerializer, InboundStatusSerializer, \
    CertificateSerializer, UserSerializer
from .utils import check_captcha

logger = logging.getLogger(__name__)


class InboundViewSet(viewsets.ModelViewSet):
    serializer_class = InboundSerializer
    queryset = Inbound.objects.all()
    permission_classes = (IsAuthenticated,)
    pagination_class = InboundPagination

    def destroy(self, request, *args, **kwargs):
        id = kwargs.get("pk")
        logger.info(f"Requested to delete inbound id {id}")
        if id:
            instance = get_object_or_404(Inbound, id=id)
            instance.delete()
            logger.info(f"Inbound id {id} deleted.")
            return Response({}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_404_NOT_FOUND)

    def perform_update(self, serializer):
        super(InboundViewSet, self).perform_update(serializer)
        logger.info("Inbounds updated")
        Inbound.create_config_json()
        Inbound.restart_xray()

    def perform_create(self, serializer):
        super(InboundViewSet, self).perform_create(serializer)
        logger.info("An inbounds created")
        Inbound.create_config_json()
        Inbound.restart_xray()


class InboundStatusView(viewsets.ModelViewSet):
    http_method_names = ["patch"]
    serializer_class = InboundStatusSerializer
    queryset = Inbound.objects.all()
    permission_classes = (IsAuthenticated,)
    pagination_class = InboundPagination

    def perform_update(self, serializer):
        super(InboundStatusView, self).perform_update(serializer)
        logger.info("Inbounds status updated")
        Inbound.create_config_json()
        Inbound.restart_xray()


class CertificateView(viewsets.ModelViewSet):
    serializer_class = CertificateSerializer
    queryset = Certificate.objects.all()
    permission_classes = (IsAuthenticated,)


class UserTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        captcha = Captcha.objects.first()
        if captcha and captcha.enable:
            recaptchaToken = request.data.get("recaptchaToken")
            captcha_result = check_captcha.verify_captcha(captcha.secret_key,recaptchaToken)
        else:
            captcha_result = True
        if captcha_result:
            serializer = self.get_serializer(data=request.data)
            try:
                serializer.is_valid(raise_exception=True)
                return Response(serializer.validated_data, status=status.HTTP_200_OK)
            except Exception as e:
                logger.error(e)
            return Response({}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ["post"]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,UpdateOwnProfile,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('username',)

    def create(self, request, *args, **kwargs):
        data = request.data
        user = request.user
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            old_password = serializer.validated_data.get('password')
            password1 = data.get("password1")
            password2 = data.get("password2")
            if not (password1 and password2 and password1 == password2 and user.check_password(old_password)):
                return Response({}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(password1)
            user.save()
            return Response({'message': 'OK'}, status=status.HTTP_200_OK)
        else:
            logger.error(serializer.errors)
        return Response({}, status=status.HTTP_400_BAD_REQUEST)


class GenerateKeyView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, key_length):
        # result = subprocess.run(["/usr/bin/openssl","rand","-base64", str(key_length)], capture_output=True)
        result = subprocess.run(["openssl", "rand", "-base64", str(key_length)], capture_output=True)
        return Response({"password": result.stdout})
