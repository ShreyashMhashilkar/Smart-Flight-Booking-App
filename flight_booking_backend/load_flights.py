import os
import django
import pandas as pd
from datetime import datetime, timedelta
from django.utils import timezone

# ---------------- Django setup ----------------
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flight_booking_backend.settings')
django.setup()

from flights.models import Flight

# ---------------- Load CSV ----------------
csv_path = r"C:\Users\lenovo\Documents\New job Projects\Smart Flight Booking App\flight_booking_backend\flights\ml\flight_price.csv"
df = pd.read_csv(csv_path)
df = df.sample(n=20000, random_state=42)  # 10k random rows
# ---------------- Time mapping ----------------
time_map = {
    'Early_Morning': 6,
    'Morning': 8,
    'Afternoon': 12,
    'Evening': 18,
    'Night': 21
}

# ---------------- Insert flights ----------------
for index, row in df.iterrows():
    try:
        dep_hour = time_map.get(row['departure_time'], 8)
        arr_hour_raw = dep_hour + float(row['duration'])
        extra_days = int(arr_hour_raw // 24)
        arr_hour = int(arr_hour_raw % 24)

        flight_date = datetime.now() + timedelta(days=int(row['days_left']))

        departure_dt = timezone.make_aware(flight_date.replace(hour=dep_hour, minute=0))
        arrival_dt = timezone.make_aware((flight_date + timedelta(days=extra_days)).replace(hour=arr_hour, minute=0))

        Flight.objects.create(
            airline=row['airline'],
            source=row['source_city'],
            destination=row['destination_city'],
            departure_time=departure_dt,
            arrival_time=arrival_dt,
            total_stops=row['stops'],
            base_price=float(row['price']),
            total_seats=100,
            available_seats=100
        )
        print(f"Inserted flight: {row['airline']} {row['flight']} from {row['source_city']} to {row['destination_city']}")
    except Exception as e:
        print(f"Error inserting row {index}: {e}")
