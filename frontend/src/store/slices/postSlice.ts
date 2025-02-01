import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface User {
  _id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
}

interface Comment {
  _id: string;
  text: string;
  user?: User;
}

interface Post {
  _id: string;
  text: string;
  postedBy: User;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

interface PostState {
  posts: Post[];
  followingPosts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  followingPosts: [],
  loading: false,
  error: null,
};

export const fetchAllPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
  "posts/fetchAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/posts/all", { withCredentials: true });
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Unable to fetch posts.");
    }
  }
);

export const fetchFollowingPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
  "posts/fetchFollowingPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/posts/following", { withCredentials: true });
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Unable to fetch following posts.");
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (text: string, { getState, rejectWithValue }) => {
    try {
      const res = await axios.post("/api/posts/create", { text }, { withCredentials: true });
      const user = (getState() as RootState).auth.user;
      return { ...res.data, postedBy: user };
    } catch (error: any) {
      return rejectWithValue("Unable to create post.");
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId: string, { getState, rejectWithValue }) => {
    try {
      await axios.post(`/api/posts/like/${postId}`, {}, { withCredentials: true });
      const state = getState() as RootState;
      const userId: string | undefined = state.auth.user?._id;
      if (!userId) return rejectWithValue("User not logged in.");
      return { postId, userId };
    } catch (error: any) {
      return rejectWithValue("Unable to like post.");
    }
  }
);

export const commentPost = createAsyncThunk(
    "posts/commentPost",
    async ({ postId, text }: { postId: string; text: string }, { getState, rejectWithValue }) => {
      try {
        const res = await axios.post(`/api/posts/comment/${postId}`, { text }, { withCredentials: true });
        const user = (getState() as RootState).auth.user;
        const lastComment = Array.isArray(res.data.comments) 
          ? res.data.comments[res.data.comments.length - 1] 
          : res.data;  
        return { postId, comment: { ...lastComment, user } };
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Unable to comment.");
      }
    }
);

const handlePending = (state: PostState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state: PostState, action: PayloadAction<string | undefined>) => {
  state.loading = false;
  state.error = action.payload ?? "Error occured";
};
  
const handleFetchAllPosts = (state: PostState, action: PayloadAction<Post[]>) => {
  state.loading = false;
  state.posts = action.payload;
};

const handleFetchFollowingPosts = (state: PostState, action: PayloadAction<Post[]>) => {
  state.loading = false;
  state.followingPosts = action.payload;
};

const handleCreatePost = (state: PostState, action: PayloadAction<Post>) => {
  const isDuplicate = state.posts.some((p) => p._id === action.payload._id);
  if (!isDuplicate) {
    state.posts.unshift(action.payload);
  }
};

const handleLikePost = (state: PostState, action: PayloadAction<{ postId: string; userId: string }>) => {
  const { postId, userId } = action.payload;
  const post = state.posts.find((p) => p._id === postId);
  const postFollowing = state.followingPosts.find((p) => p._id === postId);

  if (post) {
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId); 
    } else {
      post.likes.push(userId);
    }
  }
  if (postFollowing) {
    if (postFollowing.likes.includes(userId)) {
      postFollowing.likes = postFollowing.likes.filter((id) => id !== userId);
    } else {
      postFollowing.likes.push(userId);
    }
  }
};

const handleCommentPost = (state: PostState, action: PayloadAction<{ postId: string; comment: Comment }>) => {
  const { postId, comment } = action.payload;
  // const postIndex = state.posts.findIndex((p) => p._id === postId);
  const postIndex = state.posts.find((p) => p._id === postId);
  const postFollowing = state.followingPosts.find((p) => p._id === postId);
  if (postIndex) {
    // state.posts[postIndex].comments = [...state.posts[postIndex].comments, comment]; 
    postIndex.comments.push(comment);
  }
  if (postFollowing) {
    postFollowing.comments.push(comment);
  }
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, handlePending)
      .addCase(fetchAllPosts.fulfilled, handleFetchAllPosts)
      .addCase(fetchAllPosts.rejected, handleRejected)

      .addCase(fetchFollowingPosts.pending, handlePending)
      .addCase(fetchFollowingPosts.fulfilled, handleFetchFollowingPosts)
      .addCase(fetchFollowingPosts.rejected, handleRejected)

      .addCase(createPost.fulfilled, handleCreatePost)
      .addCase(likePost.fulfilled, handleLikePost)
      .addCase(commentPost.fulfilled, handleCommentPost);
  },
});

export default postSlice.reducer;
