"use client";
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

import { formatDate } from "@/lib/utils/format";
import { useAppSelector } from "@/store/hooks";
// import { setUserActive } from "@/store/slices/access.slice";
import { useGetAllUsers } from "@/api-services/hooks/useUser";

const COLUMN_COUNT = 5;

function RoleBadge({ role, active }: { role: string; active: boolean }) {
  if (!active) {
    return <Badge tone="neutral">{role} (Inactive)</Badge>;
  }
  return <Badge tone={role.toLowerCase() === "admin" ? "brand" : "neutral"}>{role}</Badge>;
}

export function UsersTable() {
  const filters = useAppSelector((s) => s.filters.users);
  const { data: users, pagination } = useGetAllUsers(
    filters.page,
    10,
    filters.search,
    filters.role,
    filters.status,
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
              <Th className="text-right">Status</Th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length===0 ? (
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
                    {user.name}
                    {/* Email is hidden as a column below sm â€” keep it reachable. */}
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
                      // onClick={() =>
                      //   dispatch(
                      //     setUserActive({ id: user.id, active: !user.active }),
                      //   )
                      // }
                    >
                      {user.active ? "Active" : "Inactive"}
                    </Button>
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
