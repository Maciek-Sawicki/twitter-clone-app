// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';

// interface User {
//   _id: string;
//   username: string;
//   email: string;
//   fullName: string;
//   profilePicture?: string;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   error: string | null;
// }

// export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
//   try {
//     const res = await axios.get('/api/auth/me', {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//     });
//     return res.data;
//   } catch (error) {
//     return rejectWithValue('User not found');
//   }
// });

// export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
//   try {
//     const res = await axios.post('api/auth/login', { email, password }, { withCredentials: true });
//     localStorage.setItem('token', res.data.token);
//     return res.data;
//   } catch (error) {
//     return rejectWithValue('Login failed');
//   }
// });

// export const registerUser = createAsyncThunk('auth/registerUser', async ({ username, email, password, fullName }: { username: string; email: string; password: string; fullName: string }, { rejectWithValue }) => {
//   try {
//     await axios.post('/api/auth/signup', { username, email, password, fullName });
//   } catch (error) {
//     return rejectWithValue('Registration failed');
//   }
// });

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     token: localStorage.getItem('token'),
//     loading: false,
//     error: null,
//   } as AuthState,
//   reducers: {
//     logout: (state) => {
//       localStorage.removeItem('token');
//       state.user = null;
//       state.token = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(fetchUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//       })
//       .addCase(registerUser.fulfilled, (state) => {
//         state.loading = false;
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Interfejs użytkownika
interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  profilePicture?: string;
}

// Interfejs dla Redux Store
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Pobranie zalogowanego użytkownika z backendu
export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("/api/auth/me", { withCredentials: true });
    return res.data;
  } catch (error: any) {
    return rejectWithValue("Nie udało się pobrać użytkownika");
  }
});

// Logowanie użytkownika
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password }, { withCredentials: true });
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Niepoprawne dane logowania");
    }
  }
);

export const registerUser = createAsyncThunk('auth/registerUser', async ({ username, email, password, fullName }: { username: string; email: string; password: string; fullName: string }, { rejectWithValue }) => {
  try {
    await axios.post('/api/auth/signup', { username, email, password, fullName });
  } catch (error) {
    return rejectWithValue('Registration failed');
  }
});

// Wylogowanie użytkownika
export const logout = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    return null;
  } catch (error: any) {
    return rejectWithValue("Nie udało się wylogować");
  }
});

// Stan początkowy
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

// Slice Redux do zarządzania autoryzacją
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      });
  },
});

export default authSlice.reducer;
