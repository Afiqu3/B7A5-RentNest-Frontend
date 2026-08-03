import {
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Search,
  Tag,
  UserRound,
  Users,
} from "lucide-react";

import type { SidebarNavGroup, UserRole } from "@/lib/types";

/**
 * Landing route for each role. Used by the sidebar logo, the "back to
 * dashboard" affordances, and anywhere we need a role's home screen.
 */
export const ROLE_HOME: Record<UserRole, string> = {
  TENANT: "/dashboard",
  LANDLORD: "/landlord-dashboard",
  ADMIN: "/admin-dashboard",
};

const TENANT_NAV: SidebarNavGroup[] = [
  {
    label: "Platform",
    items: [
      {
        label: "My Profile",
        href: "/dashboard",
        icon: UserRound,
        exact: true,
      },
      { label: "Browse Properties", href: "/properties", icon: Search },
      {
        label: "My Requests",
        href: "/dashboard/my-requests",
        icon: ClipboardList,
      },
      { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
    ],
  },
];

const LANDLORD_NAV: SidebarNavGroup[] = [
  {
    label: "Portfolio",
    items: [
      {
        label: "Overview",
        href: "/landlord-dashboard/landlord-overview",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        label: "My Profile",
        href: "/landlord-dashboard",
        icon: UserRound,
        exact: true,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "My Listings",
        href: "/landlord-dashboard/listings",
        icon: Building2,
      },
      {
        label: "Rental Requests",
        href: "/landlord-dashboard/landlord-requests",
        icon: ClipboardList,
      }, 
    ],
  },
];

const ADMIN_NAV: SidebarNavGroup[] = [
  {
    label: "Platform",
    items: [
      {
        label: "My Profile",
        href: "/admin-dashboard",
        icon: UserRound,
        exact: true,
      },
      {
        label: "Overview",
        href: "/admin-dashboard/overview",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        label: "Listings",
        href: "/admin-dashboard/propertyListings",
        icon: Building2,
      },
      {
        label: "Rental Requests",
        href: "/admin-dashboard/requests",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Moderation",
    items: [
      { label: "Users", href: "/admin-dashboard/users", icon: Users },
      { label: "Category", href: "/admin-dashboard/categories", icon: Tag },
    ],
  },
];

/** Shown to every role, regardless of permissions. */
export const COMMON_NAV: SidebarNavGroup = {
  label: "Account",
  items: [
    { label: "My Profile", href: "/profile", icon: UserRound, exact: true },
  ],
};

const NAV_BY_ROLE: Record<UserRole, SidebarNavGroup[]> = {
  TENANT: TENANT_NAV,
  LANDLORD: LANDLORD_NAV,
  ADMIN: ADMIN_NAV,
};

/**
 * Returns the role-specific groups followed by the shared account group.
 * Unknown roles fall back to the tenant menu so the sidebar never renders empty.
 */
export function getNavGroups(role: string | undefined): SidebarNavGroup[] {
  const groups = NAV_BY_ROLE[role as UserRole] ?? TENANT_NAV;
  return [...groups];
}
