import logging
from django.core.management.base import BaseCommand
from ...models import User, Inbound

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "This function initializes data"

    def handle(self, *args, **options):
        self.create_first_user()

    @staticmethod
    def create_first_user():
        if not User.objects.filter(username="xview"):
            User.objects.create_superuser(username="xview", password="xview")
            logger.info("xview user created")

