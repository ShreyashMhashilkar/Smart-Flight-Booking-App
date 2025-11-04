import React, { useState, useEffect } from "react";
import { getMyBookings, cancelBooking } from "../api"; // add your cancel endpoint in api.js
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedCancelId, setSelectedCancelId] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getMyBookings(token);
      setBookings(res.data);
      console.log("Fetched bookings:", res.data); // ✅ Log full API response
    } catch {
      setAlert({
        open: true,
        severity: "error",
        message: "Failed to fetch bookings",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const openCancelDialog = (bookingId) => {
    setSelectedCancelId(bookingId);
    setCancelDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setSelectedCancelId(null);
    setCancelDialogOpen(false);
  };

  const handleCancelBooking = async () => {
    try {
      await cancelBooking(selectedCancelId, token);
      setAlert({
        open: true,
        severity: "success",
        message: "Booking cancelled successfully",
      });
      closeCancelDialog();
      fetchBookings();
    } catch {
      setAlert({
        open: true,
        severity: "error",
        message: "Failed to cancel booking",
      });
    }
  };

  return (
    <>
      <Grid container spacing={3} marginTop={2} justifyContent="center">
        {bookings.length === 0 && !loading && (
          <Typography
            variant="h6"
            align="center"
            sx={{ mt: 5, width: "100%" }}
          >
            No bookings found.
          </Typography>
        )}

        {bookings.map((b) => {
          console.log("Booking data:", b); // Log each individual booking
          return (
            <Grid item xs={12} sm={6} md={4} key={b.id}>
              <Card elevation={4} sx={{ bgcolor: "#fafafa" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {b.flight.airline}{" "}
                    {b.trip_type === "return" ? "(Return)" : "(Outbound)"}
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
  {b.trip_type === "return"
    ? `${b.flight.source} → ${b.flight.destination}`
    : `${b.flight.source} → ${b.flight.destination}`}
</Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Seats Booked: <strong>{b.seats_booked}</strong>
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Price Paid: <strong>${b.price_paid.toFixed(2)}</strong>
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Booked On: {new Date(b.booked_on).toLocaleString()}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => openCancelDialog(b.id)}
                  >
                    Cancel Booking
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onClose={closeCancelDialog}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCancelDialog} color="primary">
            No
          </Button>
          <Button onClick={handleCancelBooking} color="error" autoFocus>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MyBookings;
