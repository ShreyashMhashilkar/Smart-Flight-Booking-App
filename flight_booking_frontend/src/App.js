import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import FlightSearch from "./components/FlightSearch";
import SeatSelection from "./components/SeatSelection"; // ✅ Add this line
import MyBookings from "./components/MyBookings";
import { ToastContainer } from "react-toastify";

// Import Material UI theme utilities
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme"; // <-- your theme.js file

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <>
        <ToastContainer position="top-center" autoClose={3000} />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<FlightSearch />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </Router>
      </>
    </ThemeProvider>
  );
}

export default App;
