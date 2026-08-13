"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { makeStore } from "@/store";
import { hydrateFromStorage } from "@/store/hydrate";
import { loadPersistedState } from "@/store/persist";

/**
 * Client boundary for Redux. Kept as a leaf provider so pages and layouts above
 * it stay Server Components — only this file and its consumers ship to the browser.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Lazy `useState` initialiser rather than a ref: one store per mount, created
  // exactly once, and safe to read during render (a ref is not).
  const [store] = useState(makeStore);

  // Rehydrate after mount rather than via `preloadedState`. The server has no
  // localStorage, so seeding it up front would make the first client render
  // disagree with the server HTML and trip a hydration mismatch.
  useEffect(() => {
    const persisted = loadPersistedState();
    if (persisted) store.dispatch(hydrateFromStorage(persisted));
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
