"use client";

import { useState } from "react";

import { Select } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilter } from "@/store/slices/filters.slice";
import { Button } from "../ui/button";
import { AppIcon, icons } from "../ui/app-icon";
import { SendInviteModal } from "./send-invite-modal";

const roleOptions = [
  { value: "all", label: "All roles" },
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
] as const;

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export function UsersToolbar() {
  const filters = useAppSelector((s) => s.filters.users);
  const dispatch = useAppDispatch();
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <Select
        id="users-role-filter"
        label="Role"
        options={roleOptions}
        value={filters.role}
        onChange={(e) =>
          dispatch(
            setFilter({ table: "users", patch: { role: e.target.value } }),
          )
        }
      />

      <Select
        id="users-status-filter"
        label="Status"
        options={statusOptions}
        value={filters.status}
        onChange={(e) =>
          dispatch(
            setFilter({ table: "users", patch: { status: e.target.value } }),
          )
        }
      />

      <Button size="sm" className="h-9" onClick={() => setInviteOpen(true)}>
        <AppIcon name={icons.plus} className="size-4" />
        Invite User
      </Button>

      <SendInviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}
