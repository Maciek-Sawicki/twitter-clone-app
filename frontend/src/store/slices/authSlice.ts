import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  fullName: string;
  profilePicture: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Pobranie danych użytkownika po odświeżeniu strony
export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return res.data;
  } catch (error) {
    return rejectWithValue('Błąd pobierania użytkownika');
  }
});

// Logowanie użytkownika
export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (error) {
    return rejectWithValue('Błąd logowania');
  }
});

// Rejestracja użytkownika
export const registerUser = createAsyncThunk('auth/registerUser', async ({ username, email, password, fullName }: { username: string; email: string; password: string; fullName: string }, { rejectWithValue }) => {
  try {
    await axios.post('/api/auth/signup', { username, email, password, fullName });
  } catch (error) {
    return rejectWithValue('Błąd rejestracji');
  }
});

// Slice dla autoryzacji
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  } as AuthState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
