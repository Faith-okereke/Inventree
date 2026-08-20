import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { hydrateFromStorage } from "@/store/hydrate";
import type { AuthSession, AuthUser } from "@/lib/auth/session";

export interface AuthState {
  token: string;
  user: AuthUser | null;
}

const initialState: AuthState = {
  token: "",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthSession>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearAuth(state) {
      state.token = "";
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateFromStorage, (state, action) => {
      const saved = action.payload.auth;
      if (!saved) return;
      state.token = saved.token ?? state.token;
      state.user = saved.user ?? state.user;
    });
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;