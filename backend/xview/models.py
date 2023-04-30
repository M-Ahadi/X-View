import json
import logging
import platform
import subprocess

from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

logger = logging.getLogger(__name__)


class User(AbstractUser):
    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username


class Certificate(models.Model):
    name = models.CharField(max_length=30)
    privatekey = models.CharField(max_length=10000)
    certificate = models.CharField(max_length=10000)

    class Meta:
        ordering = ["id"]


class Inbound(models.Model):
    name = models.CharField(max_length=30, default="")
    enable = models.BooleanField(default=True)
    protocol = models.CharField(max_length=30, default="")
    protocol_setting = models.CharField(max_length=300, default="")
    transport = models.CharField(max_length=50000, default="")
    bindip = models.GenericIPAddressField(default="0.0.0.0")
    port = models.IntegerField(blank=False, validators=[MinValueValidator(1000), MaxValueValidator(65536)])
    up = models.FloatField(blank=True, null=True)
    down = models.FloatField(blank=True, null=True)
    total = models.FloatField(blank=True, null=True)
    details = models.CharField(max_length=1000, blank=True, null=True)
    expire = models.IntegerField(blank=True, null=True)
    sniffing = models.BooleanField(default=True)
    tags = models.CharField(max_length=50, default="")
    certificate = models.ForeignKey(Certificate, on_delete=models.CASCADE, related_name='inbound', null=True,
                                    blank=True)
    behind_nginx = models.BooleanField(default=False)

    class Meta:
        ordering = ["id"]

    @staticmethod
    def restart_xray():
        if platform.system() == "Linux":
            logger.info("restart xray service")
            subprocess.Popen("/usr/bin/supervisorctl restart xray", shell=True)

    @staticmethod
    def create_config_json():
        rules = {
            "log": {
                "loglevel": "warning",
                "access": "/var/log/x-core/access.log"
            },
            "routing": {
                "rules": [
                    {
                        "inboundTag": [
                            "api"
                        ],
                        "outboundTag": "api",
                        "type": "field"
                    },
                    {
                        "ip": [
                            "geoip:private"
                        ],
                        "outboundTag": "blocked",
                        "type": "field"
                    },
                    {
                        "outboundTag": "blocked",
                        "protocol": [
                            "bittorrent"
                        ],
                        "type": "field"
                    }
                ]
            },
            "dns": None,
        }

        outbound = {
            "outbounds": [
                {
                    "protocol": "freedom",
                    "settings": {}
                },
                {
                    "protocol": "blackhole",
                    "settings": {},
                    "tag": "blocked"
                }
            ],
            "transport": None,
            "policy": {
                "levels": {
                    "0": {
                        "statsUserUplink": True,
                        "statsUserDownlink": True
                    }
                },
                "system": {
                    "statsInboundUplink": True,
                    "statsInboundDownlink": True,
                    "statsOutboundUplink": True,
                    "statsOutboundDownlink": True

                }
            },
            "api": {
                "services": [
                    "HandlerService",
                    "LoggerService",
                    "StatsService"
                ],
                "tag": "api"
            },
            "stats": {},
            "reverse": None,
            "fakeDns": None
        }
        inbounds_config = [{
            "listen": "127.0.0.1",
            "port": 62789,
            "protocol": "dokodemo-door",
            "settings": {
                "address": "127.0.0.1"
            },
            "streamSettings": None,
            "tag": "api",
            "sniffing": None
        }]
        inbounds_list = Inbound.objects.filter(enable=True)

        for inbound in inbounds_list:
            streamSettings = json.loads(inbound.transport)
            if streamSettings.get("security") == 'tls':
                streamSettings['tlsSettings']['certificates'] = [{
                    "certificate": inbound.certificate.certificate.split(","),
                    "key": inbound.certificate.privatekey.split(","),
                }]
            if streamSettings.get("security") == 'xtls':
                streamSettings['xtlsSettings']['certificates'] = [{
                    "certificate": inbound.certificate.certificate.split(","),
                    "key": inbound.certificate.privatekey.split(","),
                }]
            inbounds_config.append(
                {
                    "listen": inbound.bindip,
                    "port": inbound.port,
                    "protocol": inbound.protocol,
                    "settings": json.loads(inbound.protocol_setting),
                    "streamSettings": streamSettings,
                    "tag": "inbound-" + str(inbound.port),
                    "sniffing": {
                        "enabled": inbound.sniffing,
                        "destOverride": [
                            "http",
                            "tls"
                        ]
                    }
                }
            )
        total_config = {}
        total_config.update(rules)
        total_config['inbounds'] = inbounds_config
        total_config.update(outbound)
        with open("config.json", "w") as f:
            json.dump(total_config, f, indent=2)
