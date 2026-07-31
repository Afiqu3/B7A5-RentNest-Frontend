"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import {
  House,
  Info,
  Building2,
  Menu,
  X,
  Sun,
  Moon,
  LogIn,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LinkItem, NavbarProps } from "@/lib/types";
import { toast } from "sonner";
import { logout } from "@/service/logout";

const NAV_ITEMS: LinkItem[] = [
  { label: "Home", href: "/", icon: House },
  { label: "About", href: "/about", icon: Info },
  { label: "Properties", href: "/properties", icon: Building2 },
];

const userMenuItems: LinkItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/profile", icon: UserIcon },
];

// function roleLinks(role: NavUser["role"]): LinkItem[] {
//   switch (role) {
//     case "landlord":
//       return [
//         { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//         {
//           label: "My properties",
//           href: "/dashboard/properties",
//           icon: Building2,
//         },
//         { label: "Rental requests", href: "/dashboard/requests", icon: Info },
//       ];
//     case "admin":
//       return [
//         { label: "Admin dashboard", href: "/admin", icon: LayoutDashboard },
//         { label: "Moderation", href: "/admin/moderation", icon: Info },
//         { label: "Users", href: "/admin/users", icon: UserIcon },
//       ];
//     case "tenant":
//     default:
//       return [
//         { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//         { label: "My requests", href: "/dashboard/requests", icon: Info },
//         { label: "Saved homes", href: "/dashboard/saved", icon: Heart },
//       ];
//   }
// }

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

const emptySubscribe = () => () => {};

// false during SSR + first client render, true once hydrated — avoids a
// theme mismatch without calling setState inside an effect.
function useMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-hidden className="opacity-0" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative overflow-hidden"
    >
      <Sun className="size-5 scale-100 rotate-0 transition-all duration-500 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-5 scale-0 rotate-90 transition-all duration-500 dark:scale-100 dark:rotate-0" />
    </Button>
  );
}

function UserMenu({ user }: NavbarProps) {
  const router = useRouter();

  const handleUserMenuAction = async (href: string) => {
    if (href === "/dashboard") {
      if (user.data.role === "TENANT") {
        router.push("/dashboard");
      } else if (user.data.role === "LANDLORD") {
        router.push("/landlord-dashboard");
      } else if (user.data.role === "ADMIN") {
        router.push("/admin-dashboard");
      }

      return;
    }

    if (href === "/logout") {
      await logout();
      toast.success("User Logged Out Successfully!");
      router.push("/login");

      return;
    } else {
      router.push(href);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="rounded-full outline-none transition-transform focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Avatar className="size-9 border border-border">
          <AvatarFallback className="bg-primary/10 text-primary">
            <UserRound className="size-4.5" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate font-medium">{user?.data.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user?.data.email}
          </span>
          <span className="mt-1 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-primary capitalize">
            {user?.data.role}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {userMenuItems.map((item) => (
            <DropdownMenuItem
              key={item.href}
              onClick={async () => {
                await handleUserMenuAction(item.href);
              }}
            >
              <item.icon />
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={async () => {
            await handleUserMenuAction("/logout");
          }}
        >
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
            <House className="size-5" strokeWidth={2} />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            RentNest
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {user.success ? (
            <UserMenu user={user} />
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/login">
                <LogIn />
                Log in
              </Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="md:hidden"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={open ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border/60 md:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_ITEMS.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}

              {!user.success ? (
                <motion.li
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * NAV_ITEMS.length + 0.05 }}
                  className="pt-2"
                >
                  <Button asChild className="w-full">
                    <Link href="/login" onClick={closeMenu}>
                      <LogIn />
                      Log in
                    </Link>
                  </Button>
                </motion.li>
              ) : null}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
