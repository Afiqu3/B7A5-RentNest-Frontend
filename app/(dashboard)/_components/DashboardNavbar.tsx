"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { House, Sun, Moon, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/shared/UserMenu";
import { NavbarProps } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
      <Button
        variant="ghost"
        size="icon"
        aria-hidden
        tabIndex={-1}
        disabled
        className="opacity-0"
      />
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

export default function DashboardNavbar({ user }: NavbarProps) {
  return (
    // `md:top-2` matches the 8px margin SidebarInset applies in the inset
    // variant, so the sticky header pins flush with the panel instead of
    // floating above it.
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60 md:top-2 md:rounded-t-xl">
      <nav className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-5" />

          <Link
            href="/"
            className="group flex items-center gap-2 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:hidden"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
              <House className="size-5" strokeWidth={2} />
            </span>
            <span className="font-heading text-lg font-bold tracking-tight text-foreground">
              RentNest
            </span>
          </Link>

          <Link
            href="/"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
          >
            Back to site
          </Link>
        </div>

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
        </div>
      </nav>
    </header>
  );
}
