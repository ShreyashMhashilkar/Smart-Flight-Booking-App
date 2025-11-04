import React, { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Box,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ username, email, password });
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Error registering user");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
  
      }}
    >
      <Card
        elevation={10}
        sx={{
          width: "100%",
          borderRadius: 4,
          boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
          maxWidth: 420,
          bgcolor: "#ffffff",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: theme.palette.primary.main,
            }}
          >
            Create Account
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            sx={{ mb: 3, color: "text.secondary" }}
          >
            Please fill in your details to sign up
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            {/* Email Field */}
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            {/* Register Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 3,
                py: 1.2,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Register
            </Button>
          </form>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <span
                style={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegisterForm;
