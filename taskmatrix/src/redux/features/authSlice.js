import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isAuthReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setAuthReady: (state, action) => {
      state.isAuthReady = action.payload;
    },
  },
});

export const { setUser, clearUser, setAuthReady } = authSlice.actions;
export default authSlice.reducer;