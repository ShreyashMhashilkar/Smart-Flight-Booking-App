from django.contrib import admin
from .models import Flight, Booking

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'airline', 'source', 'destination', 'departure_time',
        'arrival_time', 'total_stops', 'base_price', 'total_seats', 'available_seats'
    )
    search_fields = ('airline', 'source', 'destination')
    list_filter = ('source', 'destination', 'airline')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'flight', 'seats_booked', 'price_paid', 'booked_on')
    search_fields = ('user__username', 'flight__airline')
    list_filter = ('booked_on',)
