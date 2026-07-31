"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { House, LogOut, Sparkles, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNavGroups, ROLE_HOME } from "@/lib/dashboard-nav";
import type { NavbarProps, SidebarNavItem, UserRole } from "@/lib/types";
import { logout } from "@/service/logout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */

function initialsOf(name: string | undefined) {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function isItemActive(pathname: string, item: SidebarNavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/* -------------------------------------------------------------------------- */
/*                                    brand                                   */
/* -------------------------------------------------------------------------- */

function SidebarBrand({ home }: { home: string }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          size="lg"
          tooltip="RentNest"
          className="gap-3 hover:bg-sidebar-accent/60"
        >
          <Link href={home}>
            <motion.span
              whileHover={{ rotate: -8, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            >
              <House className="size-4.5" strokeWidth={2} />
            </motion.span>
            <span className="flex min-w-0 flex-col leading-tight transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
              <span className="truncate font-heading text-base font-bold tracking-tight text-sidebar-foreground">
                RentNest
              </span>
              <span className="truncate text-[11px] font-normal text-sidebar-foreground/60">
                Rental marketplace
              </span>
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  nav item                                  */
/* -------------------------------------------------------------------------- */

function NavItem({
  item,
  active,
  index,
}: {
  item: SidebarNavItem;
  active: boolean;
  index: number;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const Icon = item.icon;

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.035, 0.35),
        ease: "easeOut",
      }}
      className="group/menu-item relative"
    >
      {/* Animated active pill — slides between items via a shared layoutId. */}
      {active && (
        <motion.span
          layoutId="sidebar-active-pill"
          aria-hidden
          className="absolute inset-0 z-0 rounded-lg bg-sidebar-accent"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}

      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={item.label}
        className={cn(
          "relative z-10 bg-transparent data-active:bg-transparent",
          active && "text-sidebar-accent-foreground",
        )}
      >
        <Link
          href={item.href}
          onClick={() => isMobile && setOpenMobile(false)}
          aria-current={active ? "page" : undefined}
        >
          <Icon
            className={cn(
              "transition-transform duration-200 group-hover/menu-button:scale-110",
              active && "text-primary",
            )}
          />
          <span className="transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
            {item.label}
          </span>
        </Link>
      </SidebarMenuButton>

      {item.badge ? (
        <SidebarMenuBadge className="z-10 bg-primary/10 text-primary">
          {item.badge > 99 ? "99+" : item.badge}
        </SidebarMenuBadge>
      ) : null}
    </motion.li>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 user footer                                */
/* -------------------------------------------------------------------------- */

function SidebarUser({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: string;
}) {
  const router = useRouter();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const [pending, startTransition] = React.useTransition();
  const collapsed = state === "collapsed" && !isMobile;

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logout();
        toast.success("Logged out successfully.");
      } catch {
        // The cookies are cleared server-side regardless, so still send the
        // user to /login — but don't claim success.
        toast.error("Something went wrong while logging out.");
      } finally {
        setOpenMobile(false);
        router.push("/login");
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 p-2 transition-all duration-300",
          collapsed && "border-transparent bg-transparent p-0",
        )}
      >
        <Avatar className="size-9 shrink-0 border border-sidebar-border">
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {initialsOf(name) || <UserRound className="size-4" />}
          </AvatarFallback>
        </Avatar>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex min-w-0 flex-1 flex-col overflow-hidden"
            >
              <span className="truncate text-sm font-medium text-sidebar-foreground">
                {name}
              </span>
              <span className="truncate text-xs text-sidebar-foreground/60">
                {email}
              </span>
              <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
                <Sparkles className="size-2.5" />
                {role}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Log out"
            disabled={pending}
            onClick={handleLogout}
            className="text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className={cn(pending && "animate-pulse")} />
            <span className="transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
              {pending ? "Logging out…" : "Log out"}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   sidebar                                  */
/* -------------------------------------------------------------------------- */

export default function DashboardSidebar({ user }: NavbarProps) {
  const pathname = usePathname();

  const profile = user?.success ? user.data : undefined;
  const role = (profile?.role ?? "TENANT") as UserRole;
  const home = ROLE_HOME[role] ?? "/dashboard";
  const groups = React.useMemo(() => getNavGroups(role), [role]);

  // Continuous index so the entry animation staggers across group boundaries.
  let itemIndex = 0;

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-none">
      <SidebarHeader className="pb-0">
        <SidebarBrand home={home} />
      </SidebarHeader>

      <SidebarContent className="mt-2" role="navigation" aria-label="Dashboard">
        {groups.map((group, groupIndex) => {
          const labelId = `sidebar-group-${group.label.toLowerCase()}`;

          return (
            <React.Fragment key={group.label}>
              {groupIndex > 0 && (
                <SidebarSeparator className="group-data-[collapsible=icon]:mx-1" />
              )}
              <SidebarGroup className="py-1">
                <SidebarGroupLabel id={labelId}>
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu aria-labelledby={labelId}>
                    {group.items.map((item) => (
                      <NavItem
                        key={item.href}
                        item={item}
                        index={itemIndex++}
                        active={isItemActive(pathname, item)}
                      />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </React.Fragment>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        {profile ? (
          <SidebarUser
            name={profile.name}
            email={profile.email}
            role={profile.role}
          />
        ) : (
          <Button asChild size="sm" className="w-full">
            <Link href="/login">
              <UserRound />
              <span className="group-data-[collapsible=icon]:hidden">
                Log in
              </span>
            </Link>
          </Button>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
