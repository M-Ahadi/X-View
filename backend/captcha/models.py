from django.db import models

# Create your models here.


class Captcha(models.Model):
    secret_key = models.CharField(max_length=50)
    site_key = models.CharField(max_length=50)
    enable = models.BooleanField(default=False)

    class Meta:
        ordering = ["id"]