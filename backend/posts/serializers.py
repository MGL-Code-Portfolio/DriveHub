from rest_framework import serializers
from .models import Post, Comment, Like


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    author_profile_picture = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_name', 'author_profile_picture', 'content', 'media', 'date_posted', 'likes_count']
        extra_kwargs = {'author': {'read_only': True}}

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_author_profile_picture(self, obj):
        if obj.author.profile_picture:
            return obj.author.profile_picture.url
        return None


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    author_profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'related_post', 'author', 'author_name', 'author_profile_picture', 'content', 'date_posted']
        extra_kwargs = {'author': {'read_only': True}, 'related_post': {'read_only': True}}

    def get_author_profile_picture(self, obj):
        if obj.author.profile_picture:
            return obj.author.profile_picture.url
        return None


class LikeSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Like
        fields = ['id', 'related_post', 'author', 'author_name']
        extra_kwargs = {'author': {'read_only': True}}
