import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApiSlice } from "../api/authApiSlice";
import { LoginResponse } from "@/utilities/interfaces";

const initialState: Partial<LoginResponse> = {
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
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApiSlice.endpoints.login.matchFulfilled,
        (state, action) => {
          return {
            user: action.payload.user,
            token: action.payload.token,
          };
        }
      )
      .addMatcher(
        authApiSlice.endpoints.logout.matchFulfilled,
        (state, action) => {
          return {};
        }
      );
  },
});

export const { setAccessToken } = authSlice.actions;

export default authSlice.reducer;
