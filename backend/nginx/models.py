import os

from django.db import models

# Create your models here.
from xview.models import Certificate


class Nginx(models.Model):
    domain = models.CharField(max_length=15)
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
    def create_nginx_config():
        data = Nginx.objects.first()
        nginx_port = os.getenv("NGINX_PORT", 443)
        if data.enable and data.domain:
            server_name = data.domain
        else:
            server_name = "_"
        if data.enable and data.certificate:
            with open("/etc/nginx/conf.d/server.conf", "w") as f:
                f.write(f"""
                listen      {nginx_port} ssl http2 default_server;
                ssl_certificate /etc/nginx/conf.d/certificate.pem;
                ssl_certificate_key /etc/nginx/conf.d/privatekey.pem;
                {data.extra_config}
                """)
            with open("/etc/nginx/conf.d/certificate.pem", "w") as f:
                f.write(data.certificate.certificate)
            with open("/etc/nginx/conf.d/privatekey.pem", "w") as f:
                f.write(data.certificate.privatekey)
        else:
            with open("/etc/nginx/conf.d/server.conf", "w") as f:
                f.write(f"""
                listen      {nginx_port} default_server;
                server_name {server_name};
                """)
