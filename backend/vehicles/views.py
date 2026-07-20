from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Vehicle
from .serializers import VehicleSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def vehicle_list(request):
    if request.method == 'GET':
        vehicles = Vehicle.objects.filter(owner=request.user)
        serializer = VehicleSerializer(vehicles, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = VehicleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def vehicle_detail(request, vehicle_id):
    vehicle = get_object_or_404(Vehicle, pk=vehicle_id)

    if request.method in ['PUT', 'DELETE']:
        if vehicle.owner != request.user and not request.user.is_staff:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = VehicleSerializer(vehicle)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = VehicleSerializer(vehicle, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        vehicle.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
