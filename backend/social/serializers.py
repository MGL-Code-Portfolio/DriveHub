from rest_framework import serializers
from .models import Friendship

class FriendshipSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    receiver_name = serializers.ReadOnlyField(source='receiver.username')
    sender_picture = serializers.SerializerMethodField()
    receiver_picture = serializers.SerializerMethodField()

    class Meta:
        model = Friendship
        fields = ['id', 'sender', 'sender_name', 'sender_picture', 'receiver', 'receiver_name', 'receiver_picture', 'status', 'created_at']
        extra_kwargs = {
            'sender': {'read_only': True},
            'status': {'read_only': True},
            'receiver': {'required': True},
        }

    def get_sender_picture(self, obj):
        if obj.sender.profile_picture:
            return obj.sender.profile_picture.url
        return None

    def get_receiver_picture(self, obj):
        if obj.receiver.profile_picture:
            return obj.receiver.profile_picture.url
        return None
