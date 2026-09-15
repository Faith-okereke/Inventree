"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { ConfirmModal } from "@/components/dashboard/dashboard-modal";
import { TableFooter } from "@/components/dashboard/table-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppIcon, icons } from "@/components/ui/app-icon";
import { IconButton } from "@/components/ui/icon-button";
import {
  Table,
  TableEmpty,
  TableScroll,
  Td,
  Th,
  Tr,
} from "@/components/ui/table";

import { formatDate } from "@/lib/utils/format";
import { useAppSelector } from "@/store/hooks";
import { useGetAllUsers } from "@/api-services/hooks/useUser";
import { useDeleteUser } from "@/api-services/hooks/useUser";
import { useRevokeInvitation } from "@/api-services/hooks/useInvitation";
import type { UserResponse } from "@/types/users";
import { cn } from "@/lib/utils/cn";

const COLUMN_COUNT = 6;
const MENU_WIDTH = 220;

type MenuPosition = {
  top: number;
  left: number;
};

function RoleBadge({ role, active }: { role: string; active: boolean }) {
  if (!active) {
    return <Badge tone="neutral">{role} (Inactive)</Badge>;
  }
  return (
    <Badge tone={role.toLowerCase() === "admin" ? "brand" : "neutral"}>
      {role}
    </Badge>
  );
}

function UserActions({ user }: { user: UserResponse }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { mutate: remove, isPending: isDeleting } = useDeleteUser(user.id);
  const invitationId = user.invitation?.id;
  const canRevoke =
    user.invitation?.status === "pending" && Boolean(invitationId);
  const { mutate: revoke, isPending: isRevoking } = useRevokeInvitation(
    invitationId ?? "",
  );

  function toggleMenu(event: React.MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const preferredLeft = rect.right - MENU_WIDTH;
    setPosition({
      top: rect.bottom + 8,
      left: Math.max(
        16,
        Math.min(preferredLeft, window.innerWidth - MENU_WIDTH - 16),
      ),
    });
    setOpen((value) => !value);
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      )
        return;
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function closeOnViewportChange() {
      setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", closeOnViewportChange, true);
    window.addEventListener("resize", closeOnViewportChange);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", closeOnViewportChange, true);
      window.removeEventListener("resize", closeOnViewportChange);
    };
  }, [open]);

  return (
    <>
      <div ref={rootRef} className="relative flex justify-end">
        <IconButton
          icon={icons.moreVertical}
          label={`Open actions for ${user.name || user.email}`}
          onClick={toggleMenu}
          className={cn(
            "grid size-8 place-items-center rounded-lg text-ink-500",
            "transition-[background-color,color,transform] duration-200 ease-out-soft",
            "hover:bg-ink-100 hover:text-ink-800 active:scale-95",
          )}
        />
      </div>

      {open && position && typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  top: position.top,
                  left: position.left,
                  width: MENU_WIDTH,
                }}
                className="fixed z-999 overflow-hidden rounded-xl border border-ink-200 bg-white p-1.5 shadow-2xl shadow-ink-900/15"
              >
                {canRevoke && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setRevokeOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-warn-700 transition-colors hover:bg-warn-50"
                  >
                    <AppIcon name={icons.close} className="size-4" />
                    Revoke invitation
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setDeleteOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50 hover:text-danger-700"
                >
                  <AppIcon name={icons.close} className="size-4" />
                  Remove user
                </button>
              </motion.div>
            </AnimatePresence>,
            document.body,
          )
        : null}

      {canRevoke && (
        <ConfirmModal
          open={revokeOpen}
          onOpenChange={setRevokeOpen}
          title="Revoke invitation?"
          description={`The invitation for ${user.email} will no longer be valid.`}
          confirmLabel={isRevoking ? "Revoking..." : "Revoke invitation"}
          danger
          loading={isRevoking}
          onConfirm={() => revoke()}
        />
      )}

      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Remove ${user.name || user.email}?`}
        description="You'll have to invite this user again if you proceed"
        confirmLabel={isDeleting ? "removing..." : "remove user"}
        danger
        loading={isDeleting}
        onConfirm={() => remove()}
      />
    </>
  );
}

export function UsersTable() {
  const filters = useAppSelector((s) => s.filters.users);
  const { data: users, pagination } = useGetAllUsers(
    filters.page,
    5,
    filters.search,
    filters.role,
    filters.status,
  );
  console.log(users);
  return (
    <Card className="animate-fade-up overflow-hidden">
      <TableScroll>
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th className="hidden sm:table-cell">Email</Th>
              <Th>Role</Th>
              <Th className="hidden md:table-cell">Date Created</Th>
              <Th className="text-right">Invite Status</Th>
              <Th className="">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length === 0 ? (
              <TableEmpty colSpan={COLUMN_COUNT}>
                No users match the current filters.
              </TableEmpty>
            ) : (
              users.map((user, index) => (
                <Tr
                  key={user.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 35}ms` }}
                >
                  <Td className="font-medium text-ink-900">
                    {user.name ? user.name : "Pending User"}

                    <span className="block text-xs font-normal text-ink-500 sm:hidden">
                      {user.email}
                    </span>
                  </Td>
                  <Td className="hidden text-ink-500 sm:table-cell">
                    {user.email}
                  </Td>
                  <Td>
                    <RoleBadge
                      role={user.memberships[0]?.role ?? "Member"}
                      active={user.active}
                    />
                  </Td>
                  <Td className="hidden text-ink-500 whitespace-nowrap md:table-cell">
                    {formatDate(user.createdAt)}
                  </Td>
                  <Td className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`capitalize 
                        ${
                          user.invitation?.status === "pending"
                            ? "text-warn-600 hover:bg-warn-50 hover:text-warn-700"
                            : user.invitation?.status === "accepted"
                              ? "text-success-700 hover:bg-success-50 "
                              : user.invitation?.status === "revoked"
                                ? "text-danger-600 hover:bg-danger-50 hover:text-danger-700"
                                : user.invitation?.status === "expired"
                                  ? "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-700"
                                  : user.invitation?.status === "declined"
                                    ? "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-700"
                                    : "text-success-700 hover:bg-success-50 "
                        }`}
                      aria-label={`${user?.invitation?.status} ${user.name}`}
                    >
                      {user.invitation?.status}
                    </Button>
                  </Td>
                  <Td className="text-right">
                    <UserActions user={user} />
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </TableScroll>

      {pagination && <TableFooter table="users" {...pagination} />}
    </Card>
  );
}
