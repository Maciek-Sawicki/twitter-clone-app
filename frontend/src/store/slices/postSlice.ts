import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Post {
    _id: string;
    text: string;
    postedBy: {
      _id: string;
      username: string;
      profilePicture: string;
    };
    likes: string[];
    comments: { text: string; _id: string; user?: { _id: string; username: string } }[];
    createdAt: string;
  }

interface PostState {
    posts: Post[];
    loading: boolean;
    error: string | null;
}

const initialState: PostState = {
    posts: [],
    loading: false,
    error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/posts/all"); 
      return res.data; 
    } catch (error: any) {
      console.error("Error fetching posts", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Error fetching posts");
    }
});

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPosts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchPosts.rejected, (state, action) => {
            state.error = action.error.message as string;
            state.loading = false;
        });
    },
});

export default postSlice.reducer;