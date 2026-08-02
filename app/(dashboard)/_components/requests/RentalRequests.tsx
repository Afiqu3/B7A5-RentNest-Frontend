"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  FileText,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type RentalRequestMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type RentalRequestItem = {
  id: string;
  status: string;
  moveInDate: string;
  durationMonths: number;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  property: {
    title: string;
    location: string;
    rentAmount: string | number;
    landlord: {
      name: string;
      email: string;
      phone: string;
    };
  };
  tenant: {
    name: string;
    email: string;
    phone: string;
  };
  payment: {
    status: string;
  };
};

type RentalRequestsProps = {
  rentals: RentalRequestItem[];
  meta: RentalRequestMeta;
  currentPage: number;
  baseHref: string;
};

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  APPROVED: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  COMPLETED: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  REJECTED: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const paymentStyles: Record<string, string> = {
  COMPLETED: "bg-emerald-500/10 text-emerald-600",
  PENDING: "bg-amber-500/10 text-amber-600",
  FAILED: "bg-rose-500/10 text-rose-600",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function buildPageHref(baseHref: string, page: number) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${baseHref}?${query}` : baseHref;
}

function getVisiblePages(totalPages: number, currentPage: number) {
  if (totalPages <= 5)
    return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }
  return pages;
}

const RentalRequests = ({
  rentals,
  meta,
  currentPage,
  baseHref,
}: RentalRequestsProps) => {
  const totalPages = Math.max(meta.totalPages || 1, 1);
  const visiblePages = getVisiblePages(totalPages, currentPage);
  const showingFrom =
    rentals.length === 0 ? 0 : (currentPage - 1) * meta.limit + 1;
  const showingTo = rentals.length === 0 ? 0 : showingFrom + rentals.length - 1;
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

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
              Rental moderation
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Rental requests overview
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Review tenancy requests, track payment progress, and keep the
                platform organized from one clean workspace.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <FileText className="size-4 text-primary" />
              {meta.total} requests found
            </div>
            <p className="mt-1">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>
      </div>

      {rentals.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <FileText className="size-6" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
            No rental requests yet
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Requests will appear here once tenants start submitting their
            applications.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-muted/70 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Property</th>
                    <th className="px-4 py-3 font-medium">Tenant</th>
                    <th className="px-4 py-3 font-medium">Schedule</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map((request, index) => (
                    <motion.tr
                      key={request.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.25 }}
                      className="border-t border-border/60 align-top"
                    >
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <div className="font-medium text-foreground">
                            {request.property.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Building2 className="size-3.5" />
                            {request.property.location}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CircleDollarSign className="size-3.5" />
                            {formatCurrency(request.property.rentAmount)} /
                            month
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-medium text-foreground">
                            <UserRound className="size-3.5" />
                            {request.tenant.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {request.tenant.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {request.tenant.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="size-3.5" />
                            Move in {formatDate(request.moveInDate)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock3 className="size-3.5" />
                            {request.durationMonths} month
                            {request.durationMonths > 1 ? "s" : ""}
                          </div>
                          <div className="text-xs">
                            Ends {formatDate(request.endDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStyles[request.payment.status] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {request.payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[request.status] ?? "bg-muted text-muted-foreground border-border"}`}
                        >
                          {request.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 lg:hidden">
            {rentals.map((request, index) => (
              <motion.article
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.25 }}
                className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {request.property.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {request.property.location}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[request.status] ?? "bg-muted text-muted-foreground border-border"}`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <UserRound className="size-3.5" />
                    {request.tenant.name} • {request.tenant.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-3.5" />
                    Move in {formatDate(request.moveInDate)}
                  </div>
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="size-3.5" />
                    {formatCurrency(request.property.rentAmount)} / month
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStyles[request.payment.status] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {request.payment.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {request.durationMonths} month
                    {request.durationMonths > 1 ? "s" : ""}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {showingFrom}-{showingTo} of {meta.total} requests
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

export default RentalRequests;
