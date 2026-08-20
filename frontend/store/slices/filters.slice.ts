import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { hydrateFromStorage } from "@/store/hydrate";

/** Every data table shares this shape, keyed by table id. */
export interface TableFilters {
  search: string;
  page: number;
  status: string;
  role: string;
}

export type TableId = "products" | "orders" | "users";

const emptyFilters: TableFilters = {
  search: "",
  page: 1,
  status: "all",
  role: "all",
};

export type FiltersState = Record<TableId, TableFilters>;

const initialState: FiltersState = {
  products: { ...emptyFilters },
  orders: { ...emptyFilters },
  users: { ...emptyFilters, status: "active" },
};

type Patch = Partial<Omit<TableFilters, "page">>;

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    /** Any filter change resets pagination â€” page 3 of a new result set is a dead end. */
    setFilter(
      state,
      action: PayloadAction<{ table: TableId; patch: Patch }>,
    ) {
      const { table, patch } = action.payload;
      Object.assign(state[table], patch, { page: 1 });
    },
    setPage(state, action: PayloadAction<{ table: TableId; page: number }>) {
      state[action.payload.table].page = Math.max(1, action.payload.page);
    },
    resetFilters(state, action: PayloadAction<TableId>) {
      state[action.payload] = { ...emptyFilters };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateFromStorage, (state, action) => {
      const saved = action.payload.filters;
      if (!saved) return;

      // Merge per table so a stored payload from an older shape can't drop keys.
      for (const table of Object.keys(state) as TableId[]) {
        if (saved[table]) Object.assign(state[table], saved[table]);
      }
    });
  },
});

export const { setFilter, setPage, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
