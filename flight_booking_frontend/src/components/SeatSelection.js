import React from "react";
import { motion } from "framer-motion";
import { Box, Typography, Divider, Chip, Stack, Button } from "@mui/material";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const ROWS = 12;
const LEFT_SEATS = 3;
const RIGHT_SEATS = 3;

const seatLabel = (row, col, side) =>
  `${row + 1}${side === "L" ? "ABC"[col] : "DEF"[col]}`;

const SeatSelection = ({
  flight,
  selectedSeats,
  onChange,
  seatPrice,
  goBack
}) => {
  const navigate = useNavigate();

  const handleSelectSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      onChange(selectedSeats.filter((s) => s !== seat));
    } else {
      onChange([...selectedSeats, seat]);
    }
  };

  const handleBookSeats = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    navigate("/mybooking");
  };

  return (
    <Box
      sx={{
        mb: 4,
        maxWidth: 400,
        mx: "auto",
        background: "linear-gradient(135deg, #f4f7fa 55%, #c4b4fa 100%)",
        borderRadius: 3,
        boxShadow: "0 4px 32px 0 rgba(94,53,177,0.13)",
        p: 3,
        mt: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          size="small"
          color="primary"
          sx={{ mr: 2 }}
          onClick={goBack}
        >
          Back
        </Button>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#49367e",
            letterSpacing: 1,
            flexGrow: 1,
            textAlign: "center",
          }}
        >
          Select Your Seat
        </Typography>
      </Box>

      {/* Flight info */}
      <Typography
        variant="subtitle1"
        sx={{
          color: "#8246bc",
          textAlign: "center",
          mb: 2,
          fontWeight: "bold",
        }}
      >
        {flight.airline} | {flight.source} → {flight.destination}
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          color: "#e94343",
          textAlign: "center",
          mb: 2,
          fontWeight: "bold",
        }}
      >
        Price per seat: ₹{seatPrice}
      </Typography>

      {/* Seat Grid */}
      <Box>
        {Array.from({ length: ROWS }).map((_, rowIdx) => (
          <Box key={rowIdx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            {/* Left Seats */}
            {Array.from({ length: LEFT_SEATS }).map((_, colIdx) => {
              const label = seatLabel(rowIdx, colIdx, "L");
              const isSelected = selectedSeats.includes(label);
              return (
                <motion.div
                  key={label}
                  whileTap={{ scale: 0.93 }}
                  whileHover={{
                    scale: 1.06,
                    boxShadow: "0 0 16px #8566ee75",
                  }}
                  onClick={() => handleSelectSeat(label)}
                  style={{
                    width: 38,
                    height: 38,
                    margin: 4,
                    backgroundColor: isSelected ? "#10c2cfff" : "#8246bc",
                    color: "#fff",
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontWeight: "bold",
                    position: "relative",
                    boxShadow: isSelected ? "0 0 12px #e94343" : "0 2px 6px #b1aedb44",
                    transition: "background 0.2s, box-shadow 0.2s",
                  }}
                >
                  <AirlineSeatReclineNormalIcon
                    sx={{
                      fontSize: 18,
                      position: "absolute",
                      left: 3,
                      top: 3,
                      opacity: 0.7,
                    }}
                  />
                  <span style={{ zIndex: 2 }}>{label}</span>
                </motion.div>
              );
            })}
            <Box sx={{ width: 32 }} />
            {/* Right Seats */}
            {Array.from({ length: RIGHT_SEATS }).map((_, colIdx) => {
              const label = seatLabel(rowIdx, colIdx, "R");
              const isSelected = selectedSeats.includes(label);
              return (
                <motion.div
                  key={label}
                  whileTap={{ scale: 0.93 }}
                  whileHover={{
                    scale: 1.06,
                    boxShadow: "0 0 16px #8566ee75",
                  }}
                  onClick={() => handleSelectSeat(label)}
                  style={{
                    width: 38,
                    height: 38,
                    margin: 4,
                    backgroundColor: isSelected ? "#10c2cfff" : "#8246bc",
                    color: "#fff",
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontWeight: "bold",
                    position: "relative",
                    boxShadow: isSelected ? "0 0 12px #e94343" : "0 2px 6px #b1aedb44",
                    transition: "background 0.2s, box-shadow 0.2s",
                  }}
                >
                  <AirlineSeatReclineNormalIcon
                    sx={{
                      fontSize: 18,
                      position: "absolute",
                      right: 3,
                      top: 3,
                      opacity: 0.7,
                    }}
                  />
                  <span style={{ zIndex: 2 }}>{label}</span>
                </motion.div>
              );
            })}
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Selected Seats Summary */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "#49367e" }}>
          Selected Seats ({selectedSeats.length})
        </Typography>

        {selectedSeats.length === 0 ? (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No seats selected yet.
          </Typography>
        ) : (
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            mb={2}
            justifyContent="center"
          >
            {selectedSeats.map((seat) => (
              <Chip
                key={seat}
                label={seat}
                color="primary"
                sx={{
                  fontWeight: "bold",
                  background: "#8246bc",
                  color: "#fff",
                  boxShadow: "0 1px 8px #b1aedb44",
                }}
              />
            ))}
          </Stack>
        )}

        {/* Total Price */}
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            color: "#4359e9ff",
            background: "#f8e9e6",
            py: 1,
            px: 2,
            borderRadius: 2,
            boxShadow: "0 1px 8px #e9434388",
            textAlign: "center",
            mb: 2,
            mt: 1,
            display: "inline-block",
          }}
        >
          Total Price: ₹{(selectedSeats.length * seatPrice).toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default SeatSelection;
