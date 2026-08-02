"use client";

import { motion } from "motion/react";
import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  ReceiptText,
  Sparkles,
  Wallet,
} from "lucide-react";

type RentalRequestSummary = {
  status: string;
  moveInDate: string;
  durationMonths: number;
  property: {
    title: string;
    description?: string;
  };
};

type PaymentItem = {
  id: string;
  transactionId: string;
  amount: string;
  status: string;
  paidAt: string;
  rentalRequestId: string;
  rentalRequest: RentalRequestSummary;
};

type PaymentsProps = {
  payments: PaymentItem[];
};

function formatCurrency(amount: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

const statusStyles: Record<string, string> = {
  PENDING: "border-amber-500/20 bg-amber-500/10 text-amber-600",
  APPROVED: "border-sky-500/20 bg-sky-500/10 text-sky-600",
  ACTIVE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  REJECTED: "border-rose-500/20 bg-rose-500/10 text-rose-600",
  COMPLETED: "border-slate-500/20 bg-slate-500/10 text-slate-600",
  PAID: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  FAILED: "border-rose-500/20 bg-rose-500/10 text-rose-600",
};

const Payments = ({ payments }: PaymentsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="rounded-3xl border border-border/70 bg-linear-to-br from-primary/10 via-background to-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Wallet className="size-4" />
              Payment history
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Rental payment overview
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Review settled payments, track monthly amounts, and keep an eye
                on transaction details for each rental.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="size-4 text-primary" />
              {payments.length} payments
            </div>
            <p className="mt-1">Updated from your latest activity</p>
          </div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <ReceiptText className="size-6" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
            No payment history yet
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Your rental payments will appear here as soon as they are recorded.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {payments.map((payment, index) => (
            <motion.article
              key={payment.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.25 }}
              className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[payment.status] ?? "border-border bg-muted text-muted-foreground"}`}
                  >
                    <BadgeCheck className="size-3.5" />
                    {payment.status}
                  </div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    {payment.rentalRequest.property.title}
                  </h2>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <CreditCard className="size-5" />
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">
                    Amount per month
                  </p>
                  <p className="mt-1 font-heading text-xl font-semibold text-foreground">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="mt-1 font-heading text-xl font-semibold text-foreground">
                    {payment.rentalRequest.durationMonths} month
                    {payment.rentalRequest.durationMonths > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CalendarDays className="size-4 text-primary" />
                    Move-in date
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatDate(payment.rentalRequest.moveInDate)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <ReceiptText className="size-4 text-primary" />
                    Paid on
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatDate(payment.paidAt)}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border/60 bg-background/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Rental request status
                    </p>
                    <p
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[payment.rentalRequest.status] ?? "bg-muted text-muted-foreground border-border"}`}
                    >
                      {payment.rentalRequest.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Transaction ID
                    </p>
                    <p className="mt-1 break-all font-mono text-sm text-foreground">
                      {payment.transactionId}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Payments;
