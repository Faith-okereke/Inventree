import { icons, type IconName } from "@/components/ui/app-icon";

export interface NavItem {
  href: "/dashboard" | "/products" | "/orders" | "/users";
  label: string;
  icon: IconName;
}

export const primaryNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: icons.dashboard },
  { href: "/products", label: "Products", icon: icons.products },
  { href: "/orders", label: "Orders", icon: icons.orders },
  { href: "/users", label: "Users", icon: icons.users },
];

export const secondaryNav = [
  { label: "Settings", icon: icons.settings },
  { label: "Logout", icon: icons.logout},

] as const;
