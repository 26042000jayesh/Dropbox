import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";


export const signup = createAsyncThunk("auth/signup", async (userData, { rejectWithValue }) => {
    try {
        const res = await api.post("/dropbox/auth/api/v1/signup", userData);
        localStorage.setItem("token", res.data.data.token);
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
});

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
    try {
        const res = await api.post("/dropbox/auth/api/v1/login", credentials);
        localStorage.setItem("token", res.data.data.token);
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Login failed");
    }
});

const initialState = {
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            localStorage.removeItem("token");
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Signup
            .addCase(signup.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(signup.fulfilled, (state, action) => { state.loading = false; state.token = action.payload.token; })
            .addCase(signup.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // Login
            .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(login.fulfilled, (state, action) => { state.loading = false; state.token = action.payload.token; })
            .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
