"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  Building2,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUserActiveStatus } from "../../_actions/usersActions";

type UserMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type UserItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  activeStatus: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type UsersProps = {
  users: UserItem[];
  meta: UserMeta;
  currentPage: number;
  baseHref: string;
};

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  BLOCKED: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const roleStyles: Record<string, string> = {
  ADMIN: "bg-primary/10 text-primary",
  LANDLORD: "bg-sky-500/10 text-sky-600",
  TENANT: "bg-violet-500/10 text-violet-600",
};

function buildPageHref(baseHref: string, page: number) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${baseHref}?${query}` : baseHref;
}

function getVisiblePages(totalPages: number, currentPage: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

const Users = ({ users, meta, currentPage, baseHref }: UsersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  );
  const totalPages = Math.max(meta.totalPages || 1, 1);
  const visiblePages = getVisiblePages(totalPages, currentPage);
  const showingFrom =
    users.length === 0 ? 0 : (currentPage - 1) * meta.limit + 1;
  const showingTo = users.length === 0 ? 0 : showingFrom + users.length - 1;
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const handleStatusChange = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    startTransition(async () => {
      try {
        const result = await updateUserActiveStatus(
          nextStatus as "ACTIVE" | "BLOCKED",
          userId,
        );
        if (result?.success) {
          toast.success(
            `User ${nextStatus === "ACTIVE" ? "activated" : "blocked"} successfully.`,
          );
        } else {
          toast.error(result?.message || "Could not update user status.");
        }
      } catch {
        toast.error("Something went wrong while updating the user's status.");
      }
    });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = searchValue.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    params.delete("page");

    router.push(`${baseHref}?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-5"
    >
      <div className="rounded-3xl border border-border/70 bg-linear-to-br from-primary/10 via-background to-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <ShieldCheck className="size-4" />
              User management
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Platform users overview
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Manage account activity, review roles, and keep the platform
                secure from one central place.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <FileText className="size-4 text-primary" />
              {meta.total} users found
            </div>
            <p className="mt-1">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by name"
              className="pl-9"
            />
          </div>
          <Button type="submit" className="sm:w-auto">
            Search
          </Button>
        </form>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <UserRound className="size-6" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
            No users found
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            New user accounts will appear here as they join the platform.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-muted/70 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.25 }}
                      className="border-t border-border/60 align-top"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <UserRound className="size-4" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {user.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${roleStyles[user.role] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="size-3.5" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="size-3.5" />
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[user.activeStatus] ?? "bg-muted text-muted-foreground border-border"}`}
                          >
                            {user.activeStatus}
                          </span>
                          <Button
                            type="button"
                            variant={
                              user.activeStatus === "ACTIVE"
                                ? "destructive"
                                : "default"
                            }
                            size="sm"
                            disabled={pending}
                            onClick={() =>
                              handleStatusChange(user.id, user.activeStatus)
                            }
                          >
                            {user.activeStatus === "ACTIVE" ? (
                              <>
                                <Ban className="mr-2 size-4" />
                                Block
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 size-4" />
                                Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 lg:hidden">
            {users.map((user, index) => (
              <motion.article
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.25 }}
                className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {user.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[user.activeStatus] ?? "bg-muted text-muted-foreground border-border"}`}
                  >
                    {user.activeStatus}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-3.5" />
                    {user.role}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-3.5" />
                    {user.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="size-3.5" />
                    Joined {formatDate(user.createdAt)}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Button
                    type="button"
                    variant={
                      user.activeStatus === "ACTIVE" ? "destructive" : "default"
                    }
                    size="sm"
                    disabled={pending}
                    onClick={() =>
                      handleStatusChange(user.id, user.activeStatus)
                    }
                  >
                    {user.activeStatus === "ACTIVE" ? "Block" : "Activate"}
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {showingFrom}-{showingTo} of {meta.total} users
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={isFirstPage}
                aria-disabled={isFirstPage}
              >
                <Link
                  href={
                    isFirstPage ? "#" : buildPageHref(baseHref, currentPage - 1)
                  }
                  aria-disabled={isFirstPage}
                  tabIndex={isFirstPage ? -1 : undefined}
                  className={isFirstPage ? "pointer-events-none" : undefined}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Previous
                </Link>
              </Button>

              {visiblePages.map((page) => (
                <Button
                  key={page}
                  asChild
                  size="sm"
                  variant={page === currentPage ? "default" : "outline"}
                >
                  <Link href={buildPageHref(baseHref, page)}>{page}</Link>
                </Button>
              ))}

              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={isLastPage}
                aria-disabled={isLastPage}
              >
                <Link
                  href={
                    isLastPage ? "#" : buildPageHref(baseHref, currentPage + 1)
                  }
                  aria-disabled={isLastPage}
                  tabIndex={isLastPage ? -1 : undefined}
                  className={isLastPage ? "pointer-events-none" : undefined}
                >
                  Next
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Users;
