# Generated by Django 3.1.12 on 2021-06-13 23:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='MainCycle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('coins_count', models.IntegerField(default=0)),
                ('auto_click_power', models.IntegerField(default=0)),
                ('click_power', models.IntegerField(default=1)),
                ('level', models.IntegerField(default=0)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cycle', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Boost',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('level', models.IntegerField()),
                ('power', models.IntegerField(default=1)),
                ('price', models.IntegerField(default=10)),
                ('boost_type', models.IntegerField(default=1)),
                ('main_cycle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='boosts', to='backend.maincycle')),
            ],
        ),
    ]
