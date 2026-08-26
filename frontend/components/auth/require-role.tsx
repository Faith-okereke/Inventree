"use client";

import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";

import type { AuthRole } from "@/types/auth";
import { useAppSelector } from "@/store/hooks";

export function RequireRole({
  roles,
  children,
}: {
  roles: readonly AuthRole[];
  children: ReactNode;
}) {
  const role = useAppSelector((state) => state.auth.user?.role);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted || !role || !roles.includes(role as AuthRole)) return null;
  return <>{children}</>;
}