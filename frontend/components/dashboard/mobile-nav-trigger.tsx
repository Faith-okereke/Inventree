"use client";

import { IconButton } from "@/components/ui/icon-button";
import { icons } from "@/components/ui/app-icon";
import { useAppDispatch } from "@/store/hooks";
import { setMobileNavOpen } from "@/store/slices/ui.slice";

/** Opens the drawer. Split out so the topbar itself stays a Server Component. */
export function MobileNavTrigger() {
  const dispatch = useAppDispatch();

  return (
    <IconButton
      icon={icons.menu}
      label="Open navigation"
      onClick={() => dispatch(setMobileNavOpen(true))}
      className="lg:hidden"
    />
  );
}
