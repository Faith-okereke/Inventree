import { DesktopSidebar, MobileSidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { StoreProvider } from "@/store/store-provider";

/**
 * Shell for the four authenticated pages.
 *
 * Server Component. `StoreProvider` is mounted here rather than in the root
 * layout so the auth routes ship no Redux at all — the store only exists on the
 * pages that actually read it.
 *
 * The page itself is the scroll container: the sidebar and topbar are both
 * `sticky`, which only works while no ancestor here clips or scrolls. Don't add
 * `overflow-hidden` or `h-dvh` to this wrapper — either one silently unpins both.
 */
export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <StoreProvider>
      <div className="flex min-h-dvh items-start">
        <DesktopSidebar />
        <MobileSidebar />

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 space-y-5 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </StoreProvider>
  );
}
