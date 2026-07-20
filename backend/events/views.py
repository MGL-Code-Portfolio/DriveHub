from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Event, EventParticipant
from .serializers import EventSerializer, EventParticipantSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def event_list(request):
    if request.method == 'GET':
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = EventSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(creator=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def event_detail(request, event_id):
    event = get_object_or_404(Event, pk=event_id)

    if request.method == 'GET':
        serializer = EventSerializer(event, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        if event.creator != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if event.creator == request.user or request.user.is_staff:
            event.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def event_participants(request, event_id):
    event = get_object_or_404(Event, pk=event_id)

    if request.method == 'GET':
        participants = EventParticipant.objects.filter(event=event)
        serializer = EventParticipantSerializer(participants, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':

        if request.user == event.creator:
            return Response(
                {"error": "You are the host of this event and cannot join as a driver or spectator."},
                status=status.HTTP_400_BAD_REQUEST
            )

        requested_role = request.data.get('role', 'spectator')

        if requested_role == 'driver':
            from vehicles.models import Vehicle
            if not Vehicle.objects.filter(owner=request.user).exists():
                return Response(
                    {"error": "You need a registered vehicle to join as driver."},
                    status=status.HTTP_403_FORBIDDEN
                )

        if EventParticipant.objects.filter(event=event, participant=request.user).exists():
            return Response(
                {"error": "You are already participating in this event."},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = {
            'event': event.id,
            'participant': request.user.id,
            'role': requested_role,
        }

        serializer = EventParticipantSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        participant = EventParticipant.objects.filter(event=event, participant=request.user)
        if participant.exists():
            participant.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Participation not found."}, status=status.HTTP_404_NOT_FOUND)