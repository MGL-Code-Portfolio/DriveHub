from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def post_list(request):
    if request.method == 'GET':
        posts = Post.objects.all().order_by('-date_posted')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def post_detail(request, post_id):
    post = get_object_or_404(Post, pk=post_id)

    if request.method == 'GET':
        serializer = PostSerializer(post)
        return Response(serializer.data)

    if post.author != request.user and not request.user.is_staff:
        return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    like_qs = Like.objects.filter(related_post=post, author=request.user)

    if like_qs.exists():
        like_qs.delete()
        return Response({"status": "unliked"}, status=status.HTTP_200_OK)

    Like.objects.create(related_post=post, author=request.user)
    return Response({"status": "liked"}, status=status.HTTP_201_CREATED)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def post_comments(request, post_id):
    post = get_object_or_404(Post, pk=post_id)

    if request.method == 'GET':
        comments = post.comments.all().order_by('-date_posted')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, related_post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
