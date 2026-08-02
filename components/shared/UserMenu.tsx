"use client";

import { LinkItem, NavbarProps } from "@/lib/types";
import { logout } from "@/service/logout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const userMenuItems: LinkItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function UserMenu({ user }: NavbarProps) {
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
