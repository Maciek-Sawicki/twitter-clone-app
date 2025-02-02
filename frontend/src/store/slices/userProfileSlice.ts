import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface UserProfile {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  coverImage?: string;
  bio?: string;
  followers: string[];
  following: string[];
  likedPost: string[];
}

interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const fetchUserProfile = createAsyncThunk("user/fetchProfile", async (username: string, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/api/users/profile/${username}`, { withCredentials: true });
    return res.data;
  } catch (error: any) {
    return rejectWithValue("Unable to fetch user's profile.");
  }
});

export const toggleFollowUser = createAsyncThunk("user/toggleFollow", async (userId: string, { getState, rejectWithValue }) => {
  try {
    await axios.post(`/api/users/follow/${userId}`, {}, { withCredentials: true });
    const loggedInUserId = (getState() as RootState).auth.user?._id;
    return { userId, loggedInUserId };
  } catch (error: any) {
    return rejectWithValue("Unable to toggle follow user.");
  }
});

const initialState: UserProfileState = {
  profile: null,
  loading: false,
  error: null,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleFollowUser.fulfilled, (state, action) => {
        if (state.profile) {
          const { loggedInUserId } = action.payload;
          if (loggedInUserId && state.profile.followers.includes(loggedInUserId)) {
            state.profile.followers = state.profile.followers.filter(id => id !== loggedInUserId);
          } else {
            if (loggedInUserId) {
              state.profile.followers.push(loggedInUserId);
            }
          }
        }
      });
  },
});

export default userProfileSlice.reducer;