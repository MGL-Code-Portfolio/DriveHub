from rest_framework import serializers
from .models import Event, EventParticipant


class EventSerializer(serializers.ModelSerializer):
    creator_name = serializers.ReadOnlyField(source='creator.username')
    is_finished = serializers.SerializerMethodField()
    has_slots_available = serializers.SerializerMethodField()
    participants_count = serializers.SerializerMethodField()
    is_participating = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'creator', 'creator_name', 'title', 'event_image',
            'description', 'location', 'start_date', 'end_date', 'slots',
            'event_type', 'created_at', 'updated_at', 'is_finished',
            'has_slots_available', 'participants_count', 'is_participating',
        ]
        extra_kwargs = {'creator': {'read_only': True}}

    def get_is_finished(self, obj):
        return obj.is_finished()

    def get_has_slots_available(self, obj):
        return obj.has_slots_available()

    def get_participants_count(self, obj):
        return obj.participants.count()

    def get_is_participating(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return EventParticipant.objects.filter(event=obj, participant=request.user).exists()
        return False


class EventParticipantSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='participant.username')
    event_title = serializers.ReadOnlyField(source='event.title')

    class Meta:
        model = EventParticipant
        fields = ['id', 'event', 'event_title', 'participant', 'username', 'role', 'vehicle', 'joined_at']
