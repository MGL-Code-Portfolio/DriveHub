from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def conversation_list(request):
    if request.method == 'GET':
        conversations = Conversation.objects.filter(
            Q(user1=request.user) | Q(user2=request.user)
        )
        serializer = ConversationSerializer(conversations, many=True, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'POST':
        other_user_id = request.data.get('other_user_id')
        if not other_user_id:
            return Response({"error": "Other user ID is required."},
                            status=status.HTTP_400_BAD_REQUEST)

        u1, u2 = sorted([request.user.id, int(other_user_id)])
        conversation, created = Conversation.objects.get_or_create(user1_id=u1, user2_id=u2)
        serializer = ConversationSerializer(conversation, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def chat_messages(request, conversation_id):
    conversation = get_object_or_404(Conversation, pk=conversation_id)

    if request.user != conversation.user1 and request.user != conversation.user2:
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        messages = conversation.messages.all().order_by('timestamp')
        conversation.messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(sender=request.user, conversation=conversation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_message(request, message_id):
    message = get_object_or_404(Message, pk=message_id)
    if message.sender == request.user:
        message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_403_FORBIDDEN)
