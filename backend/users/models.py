from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    phone = models.CharField(max_length=12, unique=True, blank=True, null=True)
    location = models.CharField(blank=True, max_length=255)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.username