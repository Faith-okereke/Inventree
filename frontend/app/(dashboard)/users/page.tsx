import type { Metadata } from "next";

import { PageHeader } from "@/components/dashboard/page-header";
import { UsersTable } from "@/components/users/users-table";
import { UsersToolbar } from "@/components/users/users-toolbar";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage system access, roles, and administrative privileges.",
};

/** Server Component. */
export default function UsersPage() {
  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Manage system access, roles, and administrative privileges."
      >
        <UsersToolbar />
      </PageHeader>

      <UsersTable />
    </>
  );
}
