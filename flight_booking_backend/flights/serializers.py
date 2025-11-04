from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Flight, Booking


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    flight = FlightSerializer(read_only=True)
    flight_id = serializers.PrimaryKeyRelatedField(
        queryset=Flight.objects.all(),
        source='flight',
        write_only=True
    )
    user = UserSerializer(read_only=True)
    trip_type = serializers.ChoiceField(choices=[('outbound', 'Outbound'), ('return', 'Return')], default='outbound')

    class Meta:
        model = Booking
        fields = ['id', 'user', 'flight', 'flight_id', 'seats_booked', 'price_paid', 'booked_on', 'trip_type']
