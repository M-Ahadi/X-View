import logging
from django.core.management.base import BaseCommand
from ...models import Nginx

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "This function makes nginx server listen"

    def handle(self, *args, **options):
        self.gen_configs()


    @staticmethod
    def gen_configs():
        Nginx.create_nginx_config()

