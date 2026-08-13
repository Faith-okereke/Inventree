import { createAction } from "@reduxjs/toolkit";

import type { PersistedState } from "@/store/persist";

/**
 * Dispatched once after mount to fold localStorage back into the store.
 *
 * Rehydrating in an effect rather than in the store's preloadedState is
 * deliberate: the server has no localStorage, so seeding it up front would make
 * the first client render disagree with the server HTML and trip a hydration
 * mismatch. Each slice folds in only the keys it owns.
 */
export const hydrateFromStorage = createAction<PersistedState>(
  "app/hydrateFromStorage",
);
