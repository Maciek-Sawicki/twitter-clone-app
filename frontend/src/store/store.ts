import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import postReducer from '../store/slices/postSlice';
import suggestedUsersReducer from "./slices/suggestedUsersSlice";
import userProfileReucer from "./slices/userProfileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    suggestedUsers: suggestedUsersReducer,
    userProfile: userProfileReucer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
