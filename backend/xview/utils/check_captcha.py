import logging

from django.conf import settings
from requests import request

logger = logging.getLogger(__name__)


def verify_captcha(secret, recaptcha_token):
    try:
        data = {"secret": secret,
                "response": recaptcha_token
                }
        response = request("POST", 'https://www.google.com/recaptcha/api/siteverify',data=data)
        return response.status_code == 200 and response.json().get("success") is True
    except Exception as e:
        logger.error(e)


