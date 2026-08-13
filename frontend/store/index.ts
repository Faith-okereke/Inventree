import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";

import accessReducer, { setUserActive } from "@/store/slices/access.slice";
import filtersReducer, {
  resetFilters,
  setFilter,
  setPage,
} from "@/store/slices/filters.slice";
import { savePersistedState } from "@/store/persist";
import uiReducer, { toggleSidebar } from "@/store/slices/ui.slice";

/**
 * Writes to localStorage only for the actions that change persisted data,
 * rather than subscribing to every dispatch. Keeps typing in a search box from
 * serialising the whole store on each keystroke.
 */
const persistListener = createListenerMiddleware();

persistListener.startListening({
  matcher: isAnyOf(
    toggleSidebar,
    setFilter,
    setPage,
    resetFilters,
    setUserActive,
  ),
  effect: (_action, api) => {
    // Collapse bursts of dispatches (e.g. fast typing) into one write.
    api.cancelActiveListeners();

    const state = api.getState() as RootState;
    savePersistedState({
      ui: { sidebarCollapsed: state.ui.sidebarCollapsed },
      filters: state.filters,
      access: state.access,
    });
  },
});

export const makeStore = () =>
  configureStore({
    reducer: {
      ui: uiReducer,
      filters: filtersReducer,
      access: accessReducer,
    },
    middleware: (getDefault) =>
      getDefault().prepend(persistListener.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
