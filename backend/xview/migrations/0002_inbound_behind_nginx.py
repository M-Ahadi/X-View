# Generated by Django 4.1.5 on 2023-04-03 13:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('xview', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='inbound',
            name='behind_nginx',
            field=models.BooleanField(default=False),
        ),
    ]
