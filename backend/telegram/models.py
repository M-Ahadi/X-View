from django.db import models

# Create your models here.


class Telegram(models.Model):
    token = models.CharField(max_length=100)
    chatid = models.CharField(max_length=15)
    enable = models.BooleanField(default=False)

    class Meta:
        ordering = ["id"]
