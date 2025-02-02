import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface SuggestedUser {
  _id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  isFollowing: boolean;
}

interface SuggestedUsersState {
  users: SuggestedUser[];
  loading: boolean;
  error: string | null;
}

export const fetchSuggestedUsers = createAsyncThunk("users/fetchSuggested", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("/api/users/suggested", { withCredentials: true });
    return res.data; 
  } catch (error: any) {
    return rejectWithValue("Unble to fetch suggested users");
  }
});

export const toggleFollowUser = createAsyncThunk("users/toggleFollow", async (userId: string, { rejectWithValue }) => {
  try {
    await axios.post(`/api/users/follow/${userId}`, {}, { withCredentials: true });
    return userId; 
  } catch (error: any) {
    return rejectWithValue("Unable to toggle follow user");
  }
});

const initialState: SuggestedUsersState = {
  users: [],
  loading: false,
  error: null,
};

const suggestedUsersSlice = createSlice({
  name: "suggestedUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestedUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchSuggestedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleFollowUser.fulfilled, (state, action) => {
        const user = state.users.find((user) => user._id === action.payload);
        if (user) {
          user.isFollowing = !user.isFollowing;
        }
      });
  },
});

export default suggestedUsersSlice.reducer;
