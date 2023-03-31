import { createSlice } from "@reduxjs/toolkit";

const state = {
  userId: null,
  userName: null,
  email: null,
  stateChange: false,
  userAvatar: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: state,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      userName: payload.userName,
      userAvatar: payload.userAvatar,
      email: payload.email,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    authSignOut: () => state,
  },
});