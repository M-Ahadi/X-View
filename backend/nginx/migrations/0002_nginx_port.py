# Generated by Django 4.1.5 on 2023-02-26 13:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nginx', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='nginx',
            name='port',
            field=models.IntegerField(default=443),
        ),
    ]
