from rest_framework import serializers
from .models import Conversation, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_name', 'content', 'timestamp', 'is_read']
        extra_kwargs = {'sender': {'read_only': True}, 'conversation': {'read_only': True}}

class ConversationSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    other_user_id = serializers.SerializerMethodField()
    other_user_picture = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'user1', 'user2', 'other_user', 'other_user_id', 'other_user_picture', 'created_at']

    def get_other_user(self, obj):
        request = self.context.get('request')
        if request and request.user == obj.user1:
            return obj.user2.username
        return obj.user1.username

    def get_other_user_id(self, obj):
        request = self.context.get('request')
        if request and request.user == obj.user1:
            return obj.user2.pk
        return obj.user1.pk

    def get_other_user_picture(self, obj):
        request = self.context.get('request')
        other = obj.user2 if request and request.user == obj.user1 else obj.user1
        if other.profile_picture:
            return other.profile_picture.url
        return None
