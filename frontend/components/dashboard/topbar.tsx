import { MobileNavTrigger } from "@/components/dashboard/mobile-nav-trigger";
import { TopbarSearch } from "@/components/dashboard/topbar-search";
import { IconButton } from "@/components/ui/icon-button";
import { icons } from "@/components/ui/app-icon";

/**
 * Server Component. Only the two interactive leaves — the drawer trigger and the
 * search field — cross the client boundary; the bar itself is static markup.
 */
export function Topbar() {
  return (
    <header className="sticky top-0  flex h-16 shrink-0 items-center gap-2 border-b border-ink-200 bg-white/85 px-3 backdrop-blur-md sm:gap-3 sm:px-6">
      <MobileNavTrigger />
      <TopbarSearch />

      <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
        <IconButton icon={icons.bell} label="Notifications" dot />
        <IconButton
          icon={icons.history}
          label="Activity history"
          className="hidden sm:grid"
        />
        <IconButton icon={icons.account} label="Account" />
      </div>
    </header>
  );
}
