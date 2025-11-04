from rest_framework import generics, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Flight, Booking
from .serializers import FlightSerializer, BookingSerializer
import joblib
import pandas as pd


class FlightList(generics.ListAPIView):
    serializer_class = FlightSerializer

    def get_queryset(self):
        source = self.request.query_params.get('source')
        destination = self.request.query_params.get('destination')

        queryset = Flight.objects.all()

        if source:
            queryset = queryset.filter(source__iexact=source)
        if destination:
            queryset = queryset.filter(destination__iexact=destination)

        # Remove duplicates based on airline + departure_time + source + destination
        queryset = queryset.order_by('airline', 'departure_time', 'source', 'destination').distinct()

        # results by departure time (earliest first)
        queryset = queryset.order_by('departure_time')[:20]

        return queryset


class BookingDetail(generics.RetrieveDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Limit to bookings owned by requesting user
        return Booking.objects.filter(user=self.request.user)

class BookingList(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        print("Authenticated user:", request.user)
        print("JWT token valid:", bool(request.auth))
        print("Data received:", request.data)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        flight = serializer.validated_data['flight']
        seats_needed = serializer.validated_data['seats_booked']
        trip_type = serializer.validated_data.get('trip_type', 'outbound')

        if flight.available_seats < seats_needed:
            raise serializers.ValidationError({'error': 'Not enough seats available'})

        flight.available_seats -= seats_needed
        flight.save()

        # Save normally
        serializer.save(user=self.request.user, trip_type=trip_type)

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)
    user = User.objects.create_user(username=username, email=email, password=password)
    refresh = RefreshToken.for_user(user)
    return Response({
        'user_id': user.id,
        'username': user.username,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    })


model = joblib.load('flights/ml/model.pkl')
encoded_columns = joblib.load('flights/ml/encoded_columns.pkl')


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def predict_price(request):
    try:
        data = request.data
        df = pd.DataFrame([{
            'airline': data.get('airline'),
            'source_city': data.get('source_city'),
            'destination_city': data.get('destination_city'),
            'stops': data.get('stops', '0'),
            'class': data.get('class', 'Economy'),
            'day': int(data.get('day')),
            'month': int(data.get('month')),
            'return_day': int(data.get('return_day', 0)),
            'return_month': int(data.get('return_month', 0))
        }])
        df_encoded = pd.get_dummies(df)
        missing_cols = set(encoded_columns) - set(df_encoded.columns)
        for col in missing_cols:
            df_encoded[col] = 0
        df_encoded = df_encoded[encoded_columns]
        price = model.predict(df_encoded)[0]
        return Response({'predicted_price': round(float(price), 2)})
    except Exception as e:
        return Response({'error': str(e)}, status=400)
