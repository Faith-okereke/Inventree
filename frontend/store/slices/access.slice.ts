import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { hydrateFromStorage } from "@/store/hydrate";

export interface AccessState {
  /**
   * user id → active. Only ids an operator has actually toggled land here, so
   * the fixture defaults stay the source of truth for everyone else.
   */
  activeOverrides: Record<string, boolean>;
}

const initialState: AccessState = { activeOverrides: {} };

const accessSlice = createSlice({
  name: "access",
  initialState,
  reducers: {
    setUserActive(
      state,
      action: PayloadAction<{ id: string; active: boolean }>,
    ) {
      state.activeOverrides[action.payload.id] = action.payload.active;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateFromStorage, (state, action) => {
      Object.assign(
        state.activeOverrides,
        action.payload.access?.activeOverrides ?? {},
      );
    });
  },
});

export const { setUserActive } = accessSlice.actions;
export default accessSlice.reducer;
