"use client";

import { useMemo } from "react";

import { TableFooter } from "@/components/dashboard/table-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableEmpty,
  TableScroll,
  Td,
  Th,
  Tr,
} from "@/components/ui/table";
import { filterUsers } from "@/lib/data/filters";
import { paginate } from "@/lib/data/pagination";
import { users } from "@/lib/data/users";
import { formatDate } from "@/lib/utils/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUserActive } from "@/store/slices/access.slice";

const COLUMN_COUNT = 5;

/** Matches the design's three role pills: Admin, Staff, Staff (Inactive). */
function RoleBadge({ role, active }: { role: string; active: boolean }) {
  if (!active) {
    return <Badge tone="neutral">{role} (Inactive)</Badge>;
  }
  return <Badge tone={role === "Admin" ? "brand" : "neutral"}>{role}</Badge>;
}

export function UsersTable() {
  const filters = useAppSelector((s) => s.filters.users);
  const overrides = useAppSelector((s) => s.access.activeOverrides);
  const dispatch = useAppDispatch();

  // Fold the persisted activate/deactivate overrides over the fixtures before
  // filtering, so the STATUS filter sees the state the operator actually set.
  const resolved = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        active: overrides[user.id] ?? user.active,
      })),
    [overrides],
  );

  const view = useMemo(
    () => paginate(filterUsers(resolved, filters), filters.page),
    [resolved, filters],
  );

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
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {view.rows.length === 0 ? (
              <TableEmpty colSpan={COLUMN_COUNT}>
                No users match the current filters.
              </TableEmpty>
            ) : (
              view.rows.map((user, index) => (
                <Tr
                  key={user.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 35}ms` }}
                >
                  <Td className="font-medium text-ink-900">
                    {user.name}
                    {/* Email is hidden as a column below sm — keep it reachable. */}
                    <span className="block text-xs font-normal text-ink-500 sm:hidden">
                      {user.email}
                    </span>
                  </Td>
                  <Td className="hidden text-ink-500 sm:table-cell">
                    {user.email}
                  </Td>
                  <Td>
                    <RoleBadge role={user.role} active={user.active} />
                  </Td>
                  <Td className="hidden text-ink-500 whitespace-nowrap md:table-cell">
                    {formatDate(user.createdAt)}
                  </Td>
                  <Td className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={
                        user.active
                          ? "text-danger-600 hover:bg-danger-50 hover:text-danger-700"
                          : "text-success-700 hover:bg-success-50"
                      }
                      aria-label={`${user.active ? "Deactivate" : "Activate"} ${user.name}`}
                      onClick={() =>
                        dispatch(
                          setUserActive({ id: user.id, active: !user.active }),
                        )
                      }
                    >
                      {user.active ? "Deactivate" : "Activate"}
                    </Button>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </TableScroll>

      <TableFooter
        table="users"
        from={view.from}
        to={view.to}
        total={view.total}
        page={view.page}
        totalPages={view.totalPages}
      />
    </Card>
  );
}
