from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    owner_name = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Vehicle
        fields = ['id', 'owner', 'owner_name', 'car_picture', 'brand', 'model', 'year', 'vehicle_type', 'description']
        extra_kwargs = {'owner': {'read_only': True}}