import logging
import os
import subprocess

from django.db import models

# Create your models here.
from xview.models import Certificate

logger = logging.getLogger(__name__)


class Nginx(models.Model):
    domain = models.CharField(max_length=15)
    port = models.IntegerField(default=443)
    enable = models.BooleanField(default=False)
    certificate = models.ForeignKey(Certificate, on_delete=models.CASCADE, related_name='nginx')
    extra_config = models.CharField(max_length=500, default="""
        ssl_prefer_server_ciphers on;
        ssl_ciphers EECDH+AESGCM:EDH+AESGCM;
        ssl_ecdh_curve secp384r1;
        ssl_session_cache shared:SSL:10m;
    """)

    class Meta:
        ordering = ["id"]

    @staticmethod
    def restart_nginx():
        logger.info("restart xray service")
        subprocess.Popen("/usr/bin/supervisorctl restart nginx", shell=True)

    @staticmethod
    def create_nginx_config():
        data = Nginx.objects.first()
        if data and data.enable and data.domain:
            server_name = data.domain
        else:
            server_name = "_"
        if data and data.enable and data.certificate:
            with open("/etc/nginx/conf.d/server.conf", "w") as f:
                if int(data.port) != int(os.getenv('NGINX_PORT')):
                    f.write(f"listen      {os.getenv('NGINX_PORT')} default_server;\n")
                f.write(f"""
                listen      {data.port} ssl http2 default_server;
                server_name {server_name};
                ssl_certificate /etc/nginx/conf.d/certificate.pem;
                ssl_certificate_key /etc/nginx/conf.d/privatekey.pem;
                {data.extra_config}
                """.replace("\r", ""))
            with open("/etc/nginx/conf.d/certificate.pem", "w") as f:
                f.write(data.certificate.certificate.replace(",", "\n"))
            with open("/etc/nginx/conf.d/privatekey.pem", "w") as f:
                f.write(data.certificate.privatekey.replace(",", "\n"))
        else:
            with open("/etc/nginx/conf.d/server.conf", "w") as f:
                f.write(f"""
                listen      {os.getenv('NGINX_PORT')} default_server;
                server_name {server_name};
                """.replace("\r", ""))
