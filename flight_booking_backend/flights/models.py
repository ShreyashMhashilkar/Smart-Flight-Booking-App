from django.db import models
from django.contrib.auth.models import User


class Flight(models.Model):
    airline = models.CharField(max_length=100)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    total_stops = models.CharField(max_length=50)
    base_price = models.FloatField()
    total_seats = models.IntegerField(default=100)
    available_seats = models.IntegerField(default=100)


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
    seats_booked = models.IntegerField(default=1)
    price_paid = models.FloatField()
    booked_on = models.DateTimeField(auto_now_add=True)
    trip_type = models.CharField(max_length=10, choices=[('outbound', 'Outbound'), ('return', 'Return')], default='outbound')
