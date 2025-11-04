// src/components/FlightList.js
import React from "react";
import {
  Card,
  Typography,
  Grid,
  Box,
  Divider,
  Paper,
  useTheme,
  Chip,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const FlightList = ({ flights, onSelect, selectedDate }) => {
  const theme = useTheme();

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // Filter unique flights
  const uniqueFlights = flights.filter(
    (flight, index, self) =>
      index ===
      self.findIndex(
        (f) =>
          f.airline === flight.airline &&
          f.source === flight.source &&
          f.destination === flight.destination &&
          f.departure_time === flight.departure_time
      )
  );

  return (
    <Paper
      elevation={5}
      sx={{
        py: 3,
        px: { xs: 1, sm: 4 },
        mx: "auto",
        mt: 3,
        mb: 4,
        borderRadius: theme.shape.borderRadius * 1.2,
        maxWidth: 1200,
        background: theme.palette.background.paper,
      }}
    >
      {formattedDate && (
        <Typography
          variant="h6"
          align="center"
          color="primary"
          sx={{ mb: 3, fontWeight: 600 }}
        >
          ✈️ Flights for{" "}
          <span style={{ color: "#ff7b00" }}>{formattedDate}</span>
        </Typography>
      )}

      <Grid container spacing={3} justifyContent="center">
        {uniqueFlights.length === 0 ? (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              color="primary"
              align="center"
              sx={{ mt: 5 }}
            >
              No flights found for selected route/date.
            </Typography>
          </Grid>
        ) : (
          uniqueFlights.map((flight) => {
            const flightTime = flight.departure_time
              ? new Date(flight.departure_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "";

            return (
              <Grid
                item
                xs={12}
                sm={6}
                key={`${flight.airline}-${flight.departure_time}-${flight.source}-${flight.destination}`}
                sx={{ display: "flex" }}
              >
                <Card
                  elevation={8}
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    minHeight: 210,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 6px 30px 0 #9e8cff55",
                    color: theme.palette.text.primary,
                    px: 2,
                    py: 2,
                    cursor: "pointer",
                    transition: "transform 0.18s, box-shadow 0.26s",
                    "&:hover": {
                      transform: "scale(1.025)",
                      boxShadow: "0 12px 48px #5d3fd399",
                    },
                  }}
                  onClick={() => onSelect(flight)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      mb: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={`${flightTime} | ${formattedDate}`}
                      color="warning"
                      sx={{
                        bgcolor: theme.palette.warning.main,
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "1rem",
                        px: 1.5,
                        letterSpacing: 0.5,
                        mr: 2,
                      }}
                    />
                    <FlightIcon
                      color="primary"
                      sx={{ fontSize: 26, mr: 1, flexShrink: 0 }}
                    />
                    <Typography
                      fontWeight="bold"
                      sx={{
                        flexGrow: 1,
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        textAlign: { xs: "left", sm: "left" },
                      }}
                    >
                      {flight.airline}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" color="text.secondary" mb={1}>
                    {flight.source} <b>→</b> {flight.destination}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Stops: <b>{flight.total_stops}</b>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="h6" fontWeight={700} color="primary">
                      ₹{(flight.predicted_price ?? flight.base_price).toFixed(2)}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    </Paper>
  );
};

export default FlightList;
