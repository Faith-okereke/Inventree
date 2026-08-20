import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { hydrateFromStorage } from "@/store/hydrate";

export interface UiState {
  /** Desktop sidebar collapsed to icon rail. Persisted. */
  sidebarCollapsed: boolean;
  /** Mobile drawer. Deliberately not persisted — it should never restore open. */
  mobileNavOpen: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  mobileNavOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateFromStorage, (state, action) => {
      state.sidebarCollapsed =
        action.payload.ui?.sidebarCollapsed ?? state.sidebarCollapsed;
    });
  },
});

export const { toggleSidebar, setMobileNavOpen } = uiSlice.actions;
export default uiSlice.reducer;