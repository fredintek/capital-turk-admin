import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApiSlice } from "../api/authApiSlice";

const initialState = {
  user: {},
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // regular Reducers
    setAccessToken: (state, action) => {
      state.token = action.payload;
    },
    logoutUser: (state, payload) => {
      state.user = {};
      state.token = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApiSlice.endpoints.login.matchFulfilled,
        (state, action) => {
          state.user = action.payload.data.user;
          state.token = action.payload.data.token;
        }
      )
      .addMatcher(
        authApiSlice.endpoints.logout.matchFulfilled,
        (state, action) => {
          state.user = {};
          state.token = "";
        }
      );
  },
});

export const { setAccessToken, logoutUser } = authSlice.actions;

export default authSlice.reducer;
