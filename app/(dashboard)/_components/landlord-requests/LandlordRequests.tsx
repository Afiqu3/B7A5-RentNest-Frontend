"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  CalendarClock,
  CalendarDays,
  Clock3,
  Hourglass,
  Inbox,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { LandlordRequest } from "@/lib/landlord-requests";
import RequestDecision from "./RequestDecision";

type LandlordRequestsProps = {
  requests: LandlordRequest[];
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

/** Palette for each request status, with a neutral fallback. */
function statusStyles(status: string) {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "APPROVED":
      return "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
    case "ACTIVE":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "COMPLETED":
      return "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400";
    case "REJECTED":
    case "CANCELLED":
      return "border-destructive/30 bg-destructive/10 text-destructive";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

const isPending = (status: string) => status?.toUpperCase() === "PENDING";

const LandlordRequests = ({ requests }: LandlordRequestsProps) => {
  const pendingCount = requests.filter((request) =>
    isPending(request.status),
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* ------------------------------ header ------------------------------ */}
      <div className="rounded-3xl border border-border/70 bg-linear-to-br from-primary/10 via-background to-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <ShieldCheck className="size-4" />
              Rental requests
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Requests for your properties
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Review who wants to rent from you and approve or decline the
                ones awaiting your decision.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat icon={Inbox} label="Total" value={String(requests.length)} />
            <Stat
              icon={Hourglass}
              label="Awaiting you"
              value={String(pendingCount)}
              accent={pendingCount > 0}
            />
          </div>
        </div>
      </div>

      {/* ------------------------------- list ------------------------------- */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
            No requests yet
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            When a tenant asks to rent one of your properties, it will show up
            here for you to review.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {requests.map((request, index) => (
            <RequestCard key={request.id} request={request} index={index} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */

const Stat = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <div
    className={cn(
      "rounded-2xl border px-4 py-3",
      accent
        ? "border-amber-500/30 bg-amber-500/10"
        : "border-border/60 bg-card/80",
    )}
  >
    <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
      <Icon
        className={cn("size-3.5", accent ? "text-amber-600" : "text-primary")}
      />
      {label}
    </div>
    <div className="mt-1 font-heading text-xl font-semibold text-foreground">
      {value}
    </div>
  </div>
);

const RequestCard = ({
  request,
  index,
}: {
  request: LandlordRequest;
  index: number;
}) => {
  const pending = isPending(request.status);
  const rent = Number(request.property?.rentAmount);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.05, 0.3),
        ease: "easeOut",
      }}
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border bg-card/70 shadow-sm backdrop-blur-sm",
        pending ? "border-amber-500/30" : "border-border/70",
      )}
    >
      {/* property */}
      <div className="flex gap-4 p-4 sm:p-5">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-muted sm:size-24">
          {request.property?.image ? (
            <Image
              src={request.property.image}
              alt={request.property.title}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-heading text-base font-semibold text-foreground">
              {request.property?.title ?? "Untitled property"}
            </h3>
            <span
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase",
                statusStyles(request.status),
              )}
            >
              {request.status}
            </span>
          </div>

          {request.property?.location ? (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-primary" />
              <span className="line-clamp-1">{request.property.location}</span>
            </p>
          ) : null}

          <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Wallet className="size-3.5 shrink-0 text-primary" />
            {Number.isFinite(rent) ? currency.format(rent) : "—"}
            <span className="text-xs font-normal text-muted-foreground">
              /mo
            </span>
          </p>
        </div>
      </div>

      <div className="mx-4 border-t border-border/60 sm:mx-5" />

      {/* tenant + schedule */}
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Tenant
          </p>
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <UserRound className="size-4 shrink-0 text-muted-foreground" />
            {request.tenant?.name ?? "—"}
          </p>
          {request.tenant?.email ? (
            <a
              href={`mailto:${request.tenant.email}`}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-4 shrink-0" />
              <span className="line-clamp-1">{request.tenant.email}</span>
            </a>
          ) : null}
          {request.tenant?.phone ? (
            <a
              href={`tel:${request.tenant.phone}`}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Phone className="size-4 shrink-0" />
              {request.tenant.phone}
            </a>
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Tenancy
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" />
            Move in {formatDate(request.moveInDate)}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="size-4 shrink-0" />
            {request.durationMonths} month
            {request.durationMonths === 1 ? "" : "s"}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarClock className="size-4 shrink-0" />
            Ends {formatDate(request.endDate)}
          </p>
        </div>
      </div>

      {/* decision */}
      {pending ? (
        <div className="mt-auto border-t border-border/60 bg-muted/30 p-4 sm:p-5">
          <RequestDecision rentalId={request.id} />
        </div>
      ) : null}
    </motion.article>
  );
};

export default LandlordRequests;
