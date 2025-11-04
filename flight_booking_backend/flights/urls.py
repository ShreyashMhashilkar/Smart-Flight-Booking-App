from django.urls import path
from .views import FlightList, BookingList, register, predict_price, BookingDetail
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('flights/', FlightList.as_view(), name='flights'),
    path('bookings/', BookingList.as_view(), name='bookings'),
    path('register/', register, name='register'),
    path('predict/', predict_price, name='predict-price'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
     path('bookings/<int:pk>/', BookingDetail.as_view(), name='booking-detail'),
]
