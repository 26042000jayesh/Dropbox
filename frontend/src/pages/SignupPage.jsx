import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup, clearError } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, Paper } from "@mui/material";

function SignupPage() {
    const [first_name, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(signup({ first_name, email, password }));
        if (result.meta.requestStatus === "fulfilled") {
            navigate("/");
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Sign Up</Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField label="First Name" fullWidth required sx={{ mb: 2 }}
                        value={first_name} onChange={(e) => setFirstName(e.target.value)} />
                    <TextField label="Email" type="email" fullWidth required sx={{ mb: 2 }}
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="Password" type="password" fullWidth required sx={{ mb: 2 }}
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" variant="contained" fullWidth disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                </form>

                <Typography sx={{ mt: 2, textAlign: "center" }}>
                    Already have an account? <Link to="/login">Login</Link>
                </Typography>
            </Paper>
        </Box>
    );
}

export default SignupPage;
