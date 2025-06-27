// FILE: redux/slices/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface User {
  name: string;
  email: string;
  photo: string;
  isAdmin: boolean;
}

interface AuthState {
  user: {
    name: string;
    email: string;
    photo: string;
    isAdmin: boolean; // ✅ already added in your code
  } | null;
}


const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
