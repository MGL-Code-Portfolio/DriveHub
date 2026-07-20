from django.db import models
from django.conf import settings
from django.utils import timezone

# Create your models here.

class Event(models.Model):
    class EventType(models.TextChoices):
        TRIP = 'trip', 'Trip'
        MEETUP = 'meetup', 'Meetup'
        RACE = 'race', 'Race'
        TRACKDAY = 'trackday', 'Trackday'

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_events'
    )

    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='EventParticipant',
        related_name='joined_events'
    )

    title = models.CharField(max_length=100)
    event_image = models.ImageField(upload_to='events/', blank=True, null=True)
    description = models.TextField()
    location = models.CharField(max_length=255)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    slots = models.PositiveIntegerField(default=1)

    event_type = models.CharField(
        max_length=20,
        choices=EventType.choices
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def is_finished(self):
        return self.end_date < timezone.now()

    def has_slots_available(self):
        return self.participants.count() < self.slots

class EventParticipant(models.Model):

    class RoleChoices(models.TextChoices):
        DRIVER = 'driver', 'Driver'
        SPECTATOR = 'spectator', 'Spectator'
        ORGANIZER = 'organizer', 'Organizer'

    event = models.ForeignKey(
        'Event',
        on_delete=models.CASCADE,
        related_name='participations'
    )

    participant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='event_participations'
    )

    role = models.CharField(
        max_length=20,
        choices=RoleChoices.choices,
        default=RoleChoices.SPECTATOR
    )

    vehicle = models.ForeignKey(
        'vehicles.Vehicle',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='event_vehicles'
    )

    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'participant')
        ordering = ['joined_at']