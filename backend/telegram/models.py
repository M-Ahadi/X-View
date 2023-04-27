import requests
from django.db import models


class Telegram(models.Model):
    token = models.CharField(max_length=100)
    chatid = models.CharField(max_length=15)
    enable = models.BooleanField(default=False)

    class Meta:
        ordering = ["id"]

    def send_message(self, message):
        if self.enable:
            try:
                message = message.replace(" ", "%20").replace("\n", "%0A")
                url = f"https://api.telegram.org/bot{self.token}/sendMessage"
                payload = f"chat_id={self.chatid}&text={message}&parse_mode=Markdown"
                headers = {'Content-Type': "application/x-www-form-urlencoded"}
                requests.request("POST", url, data=payload, headers=headers)
            except Exception as e:
                print(e)
