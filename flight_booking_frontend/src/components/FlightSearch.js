// src/components/FlightSearch.js
import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  TextField,
  Snackbar,
  Alert,
  Card,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Box,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import LoopIcon from "@mui/icons-material/Loop";
import FlightClassIcon from "@mui/icons-material/FlightClass";
import { predictPrice, getFlights, bookFlight } from "../api";
import FlightList from "./FlightList";
import SeatSelection from "./SeatSelection";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FlightSearch = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [isReturn, setIsReturn] = useState(false);

  const [flights, setFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);

  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);

  const [outboundSeats, setOutboundSeats] = useState([]);
  const [returnSeats, setReturnSeats] = useState([]);

  const [message, setMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [isBooking, setIsBooking] = useState(false);
  const [showFlightList, setShowFlightList] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const cities = ["Mumbai", "Chennai", "Bangalore", "Kolkata"];
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  const showMessage = (text, severity = "info") => {
    setMessage(text);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // ===== Fetch flights =====
  const handleSearch = async () => {
    if (!source || !destination || !departureDate) {
      showMessage("Please select source, destination, and departure date", "warning");
      return;
    }

    if (isReturn && returnDate <= departureDate) {
      showMessage("Return date must be later than departure date", "warning");
      return;
    }

    try {
      const res = await getFlights(source, destination);
      const matchedFlights = res.data || [];

      const flightsWithPrices = await Promise.all(
        matchedFlights.map(async (flight) => {
          const res = await predictPrice({
            airline: flight.airline,
            source_city: flight.source,
            destination_city: flight.destination,
            stops: flight.total_stops,
            class: "Economy",
            day: departureDate.getDate(),
            month: departureDate.getMonth() + 1,
          });
          return { ...flight, predicted_price: res.data.predicted_price };
        })
      );

      setFlights(flightsWithPrices);
      setReturnFlights([]);
      setSelectedOutbound(null);
      setSelectedReturn(null);
      setOutboundSeats([]);
      setReturnSeats([]);
      setShowFlightList(true);
      showMessage("Flights loaded successfully!", "success");
    } catch (error) {
      console.error(error);
      showMessage("Failed to fetch flights", "error");
    }
  };

  // ===== Fetch return flights =====
  const fetchReturnFlights = async () => {
    try {
      const res = await getFlights(destination, source);
      const matchedFlights = res.data || [];

      const flightsWithPrices = await Promise.all(
        matchedFlights.map(async (flight) => {
          const res = await predictPrice({
            airline: flight.airline,
            source_city: flight.source,
            destination_city: flight.destination,
            stops: flight.total_stops,
            class: "Economy",
            day: returnDate ? returnDate.getDate() : 0,
            month: returnDate ? returnDate.getMonth() + 1 : 0,
          });
          return { ...flight, predicted_price: res.data.predicted_price };
        })
      );

      setReturnFlights(flightsWithPrices);
      showMessage("Return flights loaded successfully!", "success");
    } catch (error) {
      console.error(error);
      showMessage("Failed to fetch return flights", "error");
    }
  };

  // ===== Outbound selection =====
  const handleOutboundSelect = (flight) => {
    setSelectedOutbound(flight);
    setSelectedReturn(null);
    setOutboundSeats([]);
    setReturnSeats([]);
    setShowFlightList(false);
    if (isReturn) fetchReturnFlights();
  };

  // ===== Confirm Booking =====
  const handleConfirmBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoginDialogOpen(true);
      return;
    }

    if (!selectedOutbound || outboundSeats.length === 0) {
      showMessage("Please select outbound flight and seats", "warning");
      return;
    }

    if (isReturn && (!selectedReturn || returnSeats.length === 0)) {
      showMessage("Please select return flight and seats", "warning");
      return;
    }

    try {
      setIsBooking(true);

      const outboundPrice =
        (selectedOutbound.predicted_price || selectedOutbound.base_price) * outboundSeats.length;

      const outboundData = {
        flight_id: selectedOutbound.id,
        seats_booked: outboundSeats.length,
        price_paid: outboundPrice,
        trip_type: "outbound",
      };

      await bookFlight(outboundData, token);

      if (isReturn && selectedReturn) {
        const returnPrice =
          (selectedReturn.predicted_price || selectedReturn.base_price) * returnSeats.length;

        const returnData = {
          flight_id: selectedReturn.id,
          seats_booked: returnSeats.length,
          price_paid: returnPrice,
          trip_type: "return",
        };

        await bookFlight(returnData, token);
      }

      showMessage("Booking confirmed successfully!", "success");
      setSelectedOutbound(null);
      setSelectedReturn(null);
      setOutboundSeats([]);
      setReturnSeats([]);
      setFlights([]);
      setReturnFlights([]);
      setShowFlightList(false);
    } catch (error) {
      console.error("Booking failed:", error);
      showMessage("Failed to confirm booking. Please try again.", "error");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{ mb: 3, color: theme.palette.primary.main }}
        >
          ✈️ Find Your Perfect Flight
        </Typography>

        {/* ===== Search Form ===== */}
        <Card
          elevation={8}
          sx={{
            p: isMobile ? 3 : 5,
            borderRadius: 4,
            background: "linear-gradient(145deg, #ffffff, #f8f9ff)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          }}
        >
          <Grid container spacing={isMobile ? 2 : 3} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Source City</InputLabel>
                <Select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  label="Source City"
                  startAdornment={<FlightTakeoffIcon sx={{ mr: 1 }} color="primary" />}
                >
                  {cities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Destination City</InputLabel>
                <Select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  label="Destination City"
                  startAdornment={<FlightLandIcon sx={{ mr: 1 }} color="primary" />}
                >
                  {cities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Departure Date"
                value={departureDate}
                minDate={new Date()}
                onChange={(val) => setDepartureDate(val)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Trip Type</InputLabel>
                <Select
                  value={isReturn ? "true" : "false"}
                  onChange={(e) => setIsReturn(e.target.value === "true")}
                  label="Trip Type"
                  startAdornment={<LoopIcon sx={{ mr: 1 }} color="primary" />}
                >
                  <MenuItem value="false">One Way</MenuItem>
                  <MenuItem value="true">Round Trip</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {isReturn && (
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Return Date"
                  value={returnDate}
                  minDate={departureDate || new Date()}
                  onChange={(val) => setReturnDate(val)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleSearch} sx={{ mt: 1, py: 1.5, borderRadius: 3, fontWeight: "bold", textTransform: "none", fontSize: "1rem", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", }} > Search Flights </Button>
            </Grid>
          </Grid>
        </Card>

        {/* ===== Outbound flights ===== */}
        {showFlightList && flights.length > 0 && !selectedOutbound && (
          <FlightList flights={flights} onSelect={handleOutboundSelect} selectedDate={departureDate} />
        )}

        {/* ===== Outbound seat selection ===== */}
        {selectedOutbound && (
          <SeatSelection
            flight={selectedOutbound}
            selectedSeats={outboundSeats}
            seatPrice={selectedOutbound.predicted_price || selectedOutbound.base_price || 5000}
            goBack={() => {
              setSelectedOutbound(null);
              setShowFlightList(true);
            }}
            onChange={setOutboundSeats}
          />
        )}

        {/* ===== Return flights & seats ===== */}
        {isReturn && selectedOutbound && (
          <Box sx={{ mt: 5, textAlign: "center" }}>
            <Card
              elevation={4}
              sx={{
                display: "inline-block",
                px: 4,
                py: 2,
                borderRadius: "20px",
                mb: 3,
                background: "linear-gradient(90deg, #E3F2FD, #E8EAF6)",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#283593", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <FlightClassIcon sx={{ mr: 1, color: "#3F51B5" }} /> Return Flights
              </Typography>
            </Card>

            {!selectedReturn && returnFlights.length > 0 && (
              <FlightList
                flights={returnFlights}
                onSelect={(flight) => setSelectedReturn(flight)}
                selectedDate={returnDate}
              />
            )}
            {selectedReturn && (
              <SeatSelection
                flight={selectedReturn}
                selectedSeats={returnSeats}
                seatPrice={selectedReturn.predicted_price || selectedReturn.base_price || 5000}
                goBack={() => setSelectedReturn(null)}
                onChange={setReturnSeats}
              />
            )}
          </Box>
        )}

        {/* ===== Confirm Booking ===== */}
        {((!isReturn && selectedOutbound && outboundSeats.length > 0) ||
          (isReturn &&
            selectedOutbound &&
            selectedReturn &&
            outboundSeats.length > 0 &&
            returnSeats.length > 0)) && (
          <Button
            variant="contained"
            fullWidth
            onClick={handleConfirmBooking}
            disabled={isBooking}
            sx={{
              mt: 4,
              py: 1.8,
              borderRadius: "15px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              textTransform: "none",
              color: "#fff",
              background: "linear-gradient(90deg, #00C853, #B2FF59)",
              boxShadow: "0 8px 25px rgba(0,200,83,0.5)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(90deg, #00E676, #76FF03)",
                transform: "translateY(-3px)",
                boxShadow: "0 10px 30px rgba(0,200,83,0.6)",
              },
            }}
          >
            {isBooking ? "Booking..." : "✅ Confirm Booking"}
          </Button>
        )}

        {/* Snackbar */}
        <Snackbar
          open={alertOpen}
          autoHideDuration={5000}
          onClose={() => setAlertOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={alertSeverity} sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>

       {/* Login Required Popup */}
        <Dialog
          open={loginDialogOpen}
          onClose={() => setLoginDialogOpen(false)}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              borderRadius: "24px",
              backdropFilter: "blur(20px)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,248,255,0.95))",
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
              p: 2,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 800,
              fontSize: "1.6rem",
              color: "#1565C0",
              textAlign: "center",
              letterSpacing: "0.5px",
              pb: 1,
            }}
          >
            🔐 Login Required
          </DialogTitle>

          <DialogContent sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                color: "#424242",
                fontSize: "1.05rem",
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              You need to log in to confirm your booking.  
              Please go to the login page to continue.
            </Typography>

            <img
              src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
              alt="Login Illustration"
              style={{
                width: "90px",
                height: "90px",
                opacity: 0.9,
                marginBottom: "10px",
              }}
            />
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              pb: 2,
            }}
          >
            <Button
              onClick={() => setLoginDialogOpen(false)}
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: "12px",
                background: "linear-gradient(90deg, #E0E0E0, #BDBDBD)",
                color: "#212121",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(90deg, #BDBDBD, #9E9E9E)",
                  transform: "scale(1.05)",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                setLoginDialogOpen(false);
                window.location.href = "/login"; // 👈 Redirect to login page
              }}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: "12px",
                background: "linear-gradient(90deg, #2196F3, #64B5F6)",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(33,150,243,0.4)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1976D2, #42A5F5)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(33,150,243,0.5)",
                },
              }}
            >
              Go to Login
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </LocalizationProvider>
  );
};

export default FlightSearch;
