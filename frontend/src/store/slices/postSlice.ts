// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import { RootState } from "../store";
// import { get } from "mongoose";

// interface User {
//   _id: string;
//   username: string;
//   profilePicture?: string;
// }

// interface Comment {
//   _id: string;
//   text: string;
//   user?: User;
// }

// interface Post {
//   _id: string;
//   text: string;
//   postedBy: User;
//   likes: string[];
//   comments: Comment[];
//   createdAt: string;
// }

// interface PostState {
//   posts: Post[];
//   followingPosts: Post[];
//   loading: boolean;
//   error: string | null;
// }

// // 🔥 Pobieranie wszystkich postów
// export const fetchAllPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
//   "posts/fetchAllPosts",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get("/api/posts/all", { withCredentials: true });
//       return res.data;
//     } catch (error: any) {
//       return rejectWithValue("Nie udało się pobrać postów.");
//     }
//   }
// );

// // 🔥 Pobieranie postów obserwowanych użytkowników
// export const fetchFollowingPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
//   "posts/fetchFollowingPosts",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get("/api/posts/following", { withCredentials: true });
//       return res.data;
//     } catch (error: any) {
//       return rejectWithValue("Nie udało się pobrać postów obserwowanych.");
//     }
//   }
// );

// export const createPost = createAsyncThunk(
//     "posts/createPost",
//     async (text: string, { getState, rejectWithValue }) => {
//       try {
//         const res = await axios.post("/api/posts/create", { text }, { withCredentials: true });
  
//         // Pobieramy dane użytkownika z Redux
//         const user = (getState() as RootState).auth.user;
//         return { ...res.data, postedBy: user };
//       } catch (error: any) {
//         return rejectWithValue("Nie udało się dodać postu.");
//       }
//     }
//   );
  
//   export const likePost = createAsyncThunk(
//     "posts/likePost",
//     async (postId: string, { getState, rejectWithValue }) => {
//       try {
//         await axios.post(`/api/posts/like/${postId}`, {}, { withCredentials: true });
  
//         // Pobieramy ID zalogowanego użytkownika z Redux
//         const state = getState() as RootState;
//         const userId = state.auth.user?._id;
  
//         return { postId, userId };
//       } catch (error: any) {
//         return rejectWithValue("Nie udało się polubić postu.");
//       }
//     }
//   );
  

// export const commentPost = createAsyncThunk(
//     "posts/commentPost",
//     async ({ postId, text }: { postId: string; text: string }, { getState, rejectWithValue }) => {
//       try {
//         const res = await axios.post(`/api/posts/comment/${postId}`, { text }, { withCredentials: true });
  
//         // Pobieramy dane użytkownika z Redux
//         const user = (getState() as RootState).auth.user;
//         return { postId, comment: { ...res.data, user } };
//       } catch (error: any) {
//         return rejectWithValue("Nie udało się dodać komentarza.");
//       }
//     }
//   );
  
  

// const initialState: PostState = {
//   posts: [],
//   followingPosts: [],
//   loading: false,
//   error: null,
// };

// const postSlice = createSlice({
//   name: "posts",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAllPosts.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchAllPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
//         state.loading = false;
//         state.posts = action.payload;
//       })
//       .addCase(fetchAllPosts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(fetchFollowingPosts.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchFollowingPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
//         state.loading = false;
//         state.followingPosts = action.payload;
//       })
//       .addCase(fetchFollowingPosts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(createPost.fulfilled, (state, action) => {
//         state.posts.unshift(action.payload); // Dodajemy nowy post na początek listy
//       })
//       .addCase(likePost.fulfilled, (state, action) => {
//         const post = state.posts.find((p) => p._id === action.payload);
//         if (post) post.likes.push("liked"); // Tymczasowo dodajemy polubienie
//       })
//       .addCase(commentPost.fulfilled, (state, action) => {
//         const post = state.posts.find((p) => p._id === action.payload.postId);
//         if (post) post.comments.push(action.payload.comment);
//       })
//       .addCase(likePost.fulfilled, (state, action) => {
//         const { postId, userId } = action.payload;
//         const post = state.posts.find((p) => p._id === postId);
        
//         if (post) {
//           if (post.likes.includes(userId)) {
//             post.likes = post.likes.filter((id) => id !== userId); // Unlike
//           } else {
//             post.likes.push(userId); // Like
//           }
//         }
//       });
      
//   },
// });

// export default postSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface User {
  _id: string;
  username: string;
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
      return rejectWithValue("Nie udało się pobrać postów.");
    }
  }
);

// 🔥 Pobieranie postów obserwowanych użytkowników
export const fetchFollowingPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
  "posts/fetchFollowingPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/posts/following", { withCredentials: true });
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Nie udało się pobrać postów obserwowanych.");
    }
  }
);

// 🔥 Tworzenie nowego postu
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (text: string, { getState, rejectWithValue }) => {
    try {
      const res = await axios.post("/api/posts/create", { text }, { withCredentials: true });
      const user = (getState() as RootState).auth.user;
      return { ...res.data, postedBy: user };
    } catch (error: any) {
      return rejectWithValue("Nie udało się dodać postu.");
    }
  }
);

// 🔥 Polubienie / odlubienie postu
export const likePost = createAsyncThunk(
    "posts/likePost",
    async (postId: string, { getState, rejectWithValue }) => {
      try {
        await axios.post(`/api/posts/like/${postId}`, {}, { withCredentials: true });
  
        // Pobieramy ID zalogowanego użytkownika z Redux (może być undefined)
        const state = getState() as RootState;
        const userId: string | undefined = state.auth.user?._id;
  
        if (!userId) return rejectWithValue("Użytkownik niezalogowany");
  
        return { postId, userId };
      } catch (error: any) {
        return rejectWithValue("Nie udało się polubić postu.");
      }
    }
  );
  

// 🔥 Dodanie komentarza
// export const commentPost = createAsyncThunk(
//   "posts/commentPost",
//   async ({ postId, text }: { postId: string; text: string }, { getState, rejectWithValue }) => {
//     try {
//         console.log("text wysyłany", text);
//       const res = await axios.post(`/api/posts/comment/${postId}`, { text }, { withCredentials: true });
//       const user = (getState() as RootState).auth.user;
//       return { postId, comment: { ...res.data, user } };
//     } catch (error: any) {
//       return rejectWithValue("Nie udało się dodać komentarza.");
//     }
//   }
// );

// export const commentPost = createAsyncThunk(
//     "posts/commentPost",
//     async ({ postId, text }: { postId: string; text: string }, { getState, rejectWithValue }) => {
//       try {
//         console.log("🚀 Rozpoczynamy dodawanie komentarza...");
//         console.log("📝 Tekst komentarza wysyłany do API:", text);
//         console.log("📌 ID posta:", postId);
  
//         const res = await axios.post(`/api/posts/comment/${postId}`, { text }, { withCredentials: true });
  
//         console.log("✅ Odpowiedź z API (nowy komentarz):", res.data);
  
//         const user = (getState() as RootState).auth.user;
//         console.log("👤 Pobieranie użytkownika z Redux:", user);
  
//         const newComment = { ...res.data, user };
//         console.log("🆕 Komentarz, który zostanie zapisany w Redux:", newComment);
  
//         return { postId, comment: newComment };
//       } catch (error: any) {
//         console.error("❌ Błąd podczas wysyłania komentarza:", error.response?.data || error.message);
//         return rejectWithValue(error.response?.data?.message || "Nie udało się dodać komentarza.");
//       }
//     }
//   );

export const commentPost = createAsyncThunk(
    "posts/commentPost",
    async ({ postId, text }: { postId: string; text: string }, { getState, rejectWithValue }) => {
      try {
        console.log("🚀 Rozpoczynamy dodawanie komentarza...");
        console.log("📝 Tekst komentarza wysyłany do API:", text);
        console.log("📌 ID posta:", postId);
  
        const res = await axios.post(`/api/posts/comment/${postId}`, { text }, { withCredentials: true });
  
        console.log("✅ Odpowiedź z API (wszystkie komentarze):", res.data);
  
        const user = (getState() as RootState).auth.user;
        console.log("👤 Pobieranie użytkownika z Redux:", user);
  
        // 🔥 Pobieramy tylko **ostatni komentarz** (jeśli API zwraca całą listę)
        const lastComment = Array.isArray(res.data.comments) 
          ? res.data.comments[res.data.comments.length - 1] 
          : res.data;
  
        console.log("🆕 Ostatni komentarz, który zostanie zapisany w Redux:", lastComment);
  
        return { postId, comment: { ...lastComment, user } };
      } catch (error: any) {
        console.error("❌ Błąd podczas wysyłania komentarza:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || "Nie udało się dodać komentarza.");
      }
    }
  );
  
  

/* 
-----------------------------------------------------
✅ PODZIELONE FUNKCJE DLA `extraReducers`
-----------------------------------------------------
*/

// 🔥 Obsługa `pending` (ładowanie)
const handlePending = (state: PostState) => {
  state.loading = true;
  state.error = null;
};

// 🔥 Obsługa `rejected` (błąd)
const handleRejected = (state: PostState, action: PayloadAction<string | undefined>) => {
    state.loading = false;
    state.error = action.payload ?? "Wystąpił błąd"; // Jeśli `payload` jest `undefined`, ustawiamy domyślną wiadomość
  };
  

// 🔥 Obsługa `fetchAllPosts.fulfilled`
const handleFetchAllPosts = (state: PostState, action: PayloadAction<Post[]>) => {
  state.loading = false;
  state.posts = action.payload;
};

// 🔥 Obsługa `fetchFollowingPosts.fulfilled`
const handleFetchFollowingPosts = (state: PostState, action: PayloadAction<Post[]>) => {
  state.loading = false;
  state.followingPosts = action.payload;
};

// 🔥 Obsługa `createPost.fulfilled`
const handleCreatePost = (state: PostState, action: PayloadAction<Post>) => {
    // 🔥 Usuwamy duplikaty przed dodaniem nowego postu
    const isDuplicate = state.posts.some((p) => p._id === action.payload._id);
    if (!isDuplicate) {
      state.posts.unshift(action.payload);
    }
  };
  

// 🔥 Obsługa `likePost.fulfilled`
const handleLikePost = (state: PostState, action: PayloadAction<{ postId: string; userId: string }>) => {
  const { postId, userId } = action.payload;
  const post = state.posts.find((p) => p._id === postId);
  if (post) {
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId); // Unlike
    } else {
      post.likes.push(userId); // Like
    }
  }
};

// 🔥 Obsługa `commentPost.fulfilled`
const handleCommentPost = (state: PostState, action: PayloadAction<{ postId: string; comment: Comment }>) => {
  const { postId, comment } = action.payload;
  const postIndex = state.posts.findIndex((p) => p._id === postId);

  if (postIndex !== -1) {
    state.posts[postIndex].comments = [...state.posts[postIndex].comments, comment]; // ✅ Dodajemy poprawnie komentarz
  }
  console.log("Stan Redux po dodaniu komentarza:", state.posts[postIndex].comments);
};

  
  

/* 
-----------------------------------------------------
✅ UTWORZENIE `postSlice` Z PODZIELONYMI FUNKCJAMI
-----------------------------------------------------
*/
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
