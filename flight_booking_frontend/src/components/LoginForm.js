import React, { useState } from "react";
import { loginUser } from "../api";
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
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ username, password });
      localStorage.setItem("token", res.data.access);
      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
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
          bgcolor: "#ffffff", // ✅ Pure white card
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
            Welcome Back
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            sx={{ mb: 3, color: "text.secondary" }}
          >
            Please sign in to continue
          </Typography>

          <form onSubmit={handleSubmit}>
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
              Login
            </Button>
          </form>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Don’t have an account?{" "}
              <span
                style={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/register")}
              >
                Sign up
              </span>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginForm;
