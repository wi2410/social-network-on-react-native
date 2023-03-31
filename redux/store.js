import { configureStore } from "@reduxjs/toolkit";

import { authSlice } from "./auth/authReducer";

export const store = configureStore({
  reducer: {[authSlice.name]: authSlice.reducer},
});