import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, Paper } from "@mui/material";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(login({ email, password }));
        if (result.meta.requestStatus === "fulfilled") {
            navigate("/");
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField label="Email" type="email" fullWidth required sx={{ mb: 2 }}
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="Password" type="password" fullWidth required sx={{ mb: 2 }}
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" variant="contained" fullWidth disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>

                <Typography sx={{ mt: 2, textAlign: "center" }}>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </Typography>
            </Paper>
        </Box>
    );
}

export default LoginPage;
