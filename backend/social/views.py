from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Friendship
from .serializers import FriendshipSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def friendship_list(request):
    if request.method == 'GET':
        friendships = Friendship.objects.filter(
            Q(sender=request.user) | Q(receiver=request.user)
        )
        serializer = FriendshipSerializer(friendships, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        receiver_id = request.data.get('receiver_id')
        if not receiver_id:
            return Response({"error": "Receiver ID is required."},
                            status=status.HTTP_400_BAD_REQUEST)

        if int(receiver_id) == request.user.id:
            return Response({"error": "Cannot add yourself as friend."},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = FriendshipSerializer(data={'receiver': receiver_id})
        if serializer.is_valid():
            serializer.save(sender=request.user, status='pending')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_friendship(request, friendship_id):
    friendship = get_object_or_404(Friendship, pk=friendship_id)

    if request.method == 'PUT':
        if friendship.receiver != request.user:
            return Response({"error": "Only the receiver can respond to the request."},
                            status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        if new_status in ['accepted', 'rejected']:
            friendship.status = new_status
            friendship.save()
            return Response(FriendshipSerializer(friendship).data)
        return Response({"error": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if request.user == friendship.sender or request.user == friendship.receiver:
            friendship.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)
