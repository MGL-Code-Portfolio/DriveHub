from django.db import models
from django.conf import settings

# Create your models here.

class Post(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts'
    )

    content = models.TextField()
    media = models.FileField(upload_to='posts/', blank=True, null=True)
    date_posted = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    related_post = models.ForeignKey(
        'Post',
        on_delete=models.CASCADE,
        related_name='comments'
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    content = models.CharField(max_length=200)
    date_posted = models.DateTimeField(auto_now_add=True)

class Like(models.Model):
    related_post = models.ForeignKey(
        'Post',
        on_delete=models.CASCADE,
        related_name='likes'
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='likes'
    )

    class Meta:
        unique_together = ('related_post', 'author')