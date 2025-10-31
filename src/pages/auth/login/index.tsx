import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Divider,
  IconButton,
  Avatar,
  useTheme,
  FormLabel,
} from "@mui/material";
import {
  LockPersonOutlined,
  PasswordOutlined,
  PersonOutlineOutlined,
  RemoveRedEyeOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { setAuthUser } from "../../../redux/reducer/authUserSlice";
import { loginService } from "../../../utils/services/auth.service";
import { encryptText } from "../../../utils/utils";

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!username || !password) {
      setErrorMessage("Please enter email and password.");
      setLoading(false);
      return;
    }

    const payload = { username, password };
    const { code, data, message } = await loginService(payload);

    if (code === 200 && data) {
      const rec = {
        userDetails: data.User,
        token: data.Token,
        session_expires: data.ExpiresAt,
      };
      dispatch(setAuthUser(rec));
      const encrypted = JSON.stringify(rec);
      localStorage.setItem("user_auth_session", encryptText(encrypted));
      dispatch(
        showSnackbar({
          type: "success",
          message: `✅ Login Successful \n Welcome, ${rec?.userDetails?.name}`,
        })
      );
      navigate("/admin/dashboard");
    } else {
      setErrorMessage("Invalid username or password.");
      dispatch(
        showSnackbar({
          type: "error",
          message: message || "Something went wrong, please try again",
        })
      );
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            bgcolor: "#fff",
            p: 4,
            borderRadius: 3,
            boxShadow: "0px 10px 40px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Logo/Icon */}
          <Avatar
            sx={{
              width: 64,
              height: 64,
              backgroundColor: theme.palette.primary.main,
              mb: 2,
            }}
          >
            <LockPersonOutlined fontSize="large" />
          </Avatar>

          {/* Title */}
          <Typography component="h1" variant="h5" fontWeight={700} gutterBottom>
            Product Management App
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Sign in to manage your products and QR codes
          </Typography>

          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: "100%" }}
          >
            {/* Username Field */}
            <TextField
              variant="outlined"
              size="small"
              margin="normal"
              required
              fullWidth
              placeholder="Enter username or email"
              label="Username / Email"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMessage("");
              }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineOutlined fontSize="small" color="primary" />
                    <Divider orientation="vertical" sx={{ height: 20, ml: 1 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused": {
                    boxShadow: "0 0 8px rgba(102, 126, 234, 0.3)",
                  },
                },
              }}
            />

            {/* Password Field */}
            <TextField
              variant="outlined"
              size="small"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordOutlined fontSize="small" color="primary" />
                    <Divider orientation="vertical" sx={{ height: 20, ml: 1 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <RemoveRedEyeOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused": {
                    boxShadow: "0 0 8px rgba(102, 126, 234, 0.3)",
                  },
                },
              }}
            />

            {/* Error Message */}
            {errorMessage && (
              <Box display="flex" justifyContent="center" mt={1}>
                <FormLabel error>{errorMessage}</FormLabel>
              </Box>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0px 4px 12px rgba(102, 126, 234, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  boxShadow: "0px 6px 18px rgba(102, 126, 234, 0.6)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Footer Links */}
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/forgot-password")}
                sx={{ textTransform: "none" }}
              >
                Forgot Password?
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Typography
          variant="body2"
          color="white"
          align="center"
          sx={{ mt: 3 }}
        >
          © {new Date().getFullYear()} Product Management System. All rights
          reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginPage;
