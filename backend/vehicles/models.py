from django.db import models
from django.conf import settings

class Vehicle(models.Model):
    class VehicleType(models.TextChoices):
        CAR = 'car', 'Car'
        MOTORCYCLE = 'motorcycle', 'Motorcycle'

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='vehicles'
    )

    car_picture = models.ImageField(upload_to='car_pictures/', blank=True, null=True)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    vehicle_type = models.CharField(
        max_length=20,
        choices=VehicleType.choices
    )
    description = models.TextField()

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"