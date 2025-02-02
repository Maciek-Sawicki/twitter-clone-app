import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  following: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("/api/auth/me", { withCredentials: true });
    return res.data;
  } catch (error: any) {
    return rejectWithValue("User not found");
  }
});

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password }, { withCredentials: true });
      //console.log("Login response:", res.data); 
      return { user: res.data, token: res.data.token }; 
    } catch (error: any) {
      return rejectWithValue("Invalid email or password");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    { username, email, password, fullName }: { username: string; email: string; password: string; fullName: string },
    { rejectWithValue }
  ) => {
    try {
      if (!username || !email || !password || !fullName) {
        return rejectWithValue("All fields are required");
      }
      if (username.length < 3) {
        return rejectWithValue("Username must have at least 3 characters");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return rejectWithValue("Invalid email");
      }
      if (password.length < 6) {
        return rejectWithValue("Password must have at least 6 characters");
      }

      await axios.post("/api/auth/signup", { username, email, password, fullName });

      return "Registration successful";
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || "Registration failed");
      }
      return rejectWithValue("Server error. Please try again.");
    }
  }
);

export const logout = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
      return null;
  } catch (error: any) {
      return rejectWithValue("Logout failed");
  }
});

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
      //console.log("Redux login success:", action.payload);
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    })
    .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
      //console.log("Redux fetchUser success:", action.payload);
      state.user = action.payload;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.error = action.payload as string;
    })
    .addCase(fetchUser.rejected, (state, action) => {
      state.error = action.payload as string;
    })
    .addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    })
    .addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null; 
      state.successMessage = null; 
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload as string;
      state.error = null;
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.successMessage = null; 
    });
  },
});

export default authSlice.reducer;
