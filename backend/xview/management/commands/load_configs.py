import logging
from django.core.management.base import BaseCommand
from ...models import User, Inbound

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "This function initializes data"

    def handle(self, *args, **options):
        self.load_configs()


    @staticmethod
    def load_configs():
        Inbound.create_config_json()

