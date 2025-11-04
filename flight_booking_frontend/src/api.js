import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export const registerUser = (data) => apiClient.post(`/register/`, data);
export const loginUser = (data) => apiClient.post(`/login/`, data);
export const getFlights = (source, destination) =>
  apiClient.get(`/flights/`, { params: { source, destination } });
export const getMyBookings = (token) =>
  apiClient.get(`/bookings/`, { headers: { Authorization: `Bearer ${token}` } });
export const bookFlight = (data, token) =>
  apiClient.post(`/bookings/`, data, { headers: { Authorization: `Bearer ${token}` } });
export const predictPrice = (data) => apiClient.post(`/predict/`, data);
export const cancelBooking = (bookingId, token) =>
  axios.delete(`${API_URL}/bookings/${bookingId}/`, { headers: { Authorization: `Bearer ${token}` } });
