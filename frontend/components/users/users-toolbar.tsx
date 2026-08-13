"use client";

import { AppIcon, icons } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilter } from "@/store/slices/filters.slice";

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

/** ROLE and STATUS sit inline in this design rather than behind a Filter button. */
export function UsersToolbar() {
  const filters = useAppSelector((s) => s.filters.users);
  const dispatch = useAppDispatch();

  return (
    <>
      <Select
        id="users-role-filter"
        label="Role"
        options={roleOptions}
        value={filters.role}
        onChange={(e) =>
          dispatch(setFilter({ table: "users", patch: { role: e.target.value } }))
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

      {/* No "add user" frame in the Figma set — the affordance is here, the
          form it should open is not designed yet. */}
      <Button size="sm" className="h-9">
        <AppIcon name={icons.plus} className="size-4" />
        Add New User
      </Button>
    </>
  );
}
