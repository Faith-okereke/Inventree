import { redirect } from "next/navigation";

/**
 * The Figma set has no marketing landing page — the app starts at sign-in.
 * `redirect` throws during render, so nothing here is ever sent to the browser.
 */
export default function RootPage() {
  redirect("/login");
}
