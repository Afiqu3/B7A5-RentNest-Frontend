"use client";

import * as React from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  CreditCard,
  MessageSquarePlus,
  ReceiptText,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  createReview,
  getPaymentUrl,
  isReviewed,
} from "../../_actions/myRequestActions";

type PropertySummary = {
  id: string;
  title: string;
  description?: string;
  location: string;
  address?: string;
  rentAmount: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSquareFt?: number;
  amenities?: string[];
  status?: string;
};

type RentalRequestItem = {
  id: string;
  status: string;
  moveInDate: string;
  durationMonths: number;
  endDate: string;
  property: PropertySummary;
};

type MyRequestsProps = {
  requests: RentalRequestItem[];
};

function formatCurrency(value: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusStyles(status: string) {
  switch (status) {
    case "PENDING":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700";
    case "APPROVED":
      return "border-sky-500/30 bg-sky-500/10 text-sky-700";
    case "REJECTED":
      return "border-rose-500/30 bg-rose-500/10 text-rose-700";
    case "ACTIVE":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700";
    case "COMPLETED":
      return "border-slate-500/30 bg-slate-500/10 text-slate-700";
    default:
      return "border-muted bg-muted text-muted-foreground";
  }
}

const MyRequests = ({ requests }: MyRequestsProps) => {
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] =
    React.useState<RentalRequestItem | null>(null);
  const [isRedirecting, setIsRedirecting] = React.useState<string | null>(null);
  const [reviewedIds, setReviewedIds] = React.useState<string[]>([]);
  const [rating, setRating] = React.useState("5");
  const [comment, setComment] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handlePayNow = async (rentalId: string) => {
    try {
      setIsRedirecting(rentalId);
      const result = await getPaymentUrl(rentalId);
      const url = result.data.transactionResult;
      if (url) {
        window.location.assign(url);
      }
    } catch {
      toast.error("Unable to open payment link right now.");
      setIsRedirecting(null);
    }
  };

  const handleOpenReview = async (request: RentalRequestItem) => {
    setSelectedRequest(request);
    try {
      const reviewed = await isReviewed(request.id);
      if (reviewed) {
        setReviewedIds((current) => [...current, request.id]);
        toast.info("You have already reviewed this request.");
        setReviewOpen(false);
        return;
      }
    } catch {
      // Ignore and allow the modal to open.
    }

    setReviewOpen(true);
  };

  const handleSubmitReview = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!selectedRequest) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("rating", rating);
      formData.set("comment", comment);
      formData.set("rentalRequestId", selectedRequest.id);

      const result = await createReview(
        { success: false, statusCode: 0, message: "", data: {} },
        formData,
      );

      if (result?.success) {
        toast.success("Review submitted successfully.");
        setReviewedIds((current) => [...current, selectedRequest.id]);
        setReviewOpen(false);
        setComment("");
        setRating("5");
      } else {
        toast.error(result?.message || "Could not submit your review.");
      }
    } catch {
      toast.error("Unable to submit your review right now.");
    } finally {
      setSubmitting(false);
    }
  };

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
              <ReceiptText className="size-4" />
              My rental requests
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Your rental journey at a glance
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Track statuses, pay approved requests, and leave a review once a
                rental is completed.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="size-4 text-primary" />
              {requests.length} requests
            </div>
            <p className="mt-1">Everything you need in one place</p>
          </div>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Wallet className="size-6" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
            No rental requests yet
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Your submitted requests will appear here once they are created.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {requests.map((request, index) => {
            const isReviewedRequest = reviewedIds.includes(request.id);
            return (
              <motion.article
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.25 }}
                className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyles(request.status)}`}
                    >
                      <BadgeCheck className="size-3.5" />
                      {formatStatus(request.status)}
                    </div>
                    <h2 className="mt-3 font-heading text-lg font-semibold text-foreground">
                      {request.property.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {request.property.location} • {request.property.address}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Wallet className="size-5" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-sm text-muted-foreground">Rent amount</p>
                    <p className="mt-1 font-heading text-xl font-semibold text-foreground">
                      {formatCurrency(request.property.rentAmount)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="mt-1 font-heading text-xl font-semibold text-foreground">
                      {request.durationMonths} month
                      {request.durationMonths > 1 ? "s" : ""}
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
                      {formatDate(request.moveInDate)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Clock3 className="size-4 text-primary" />
                      End date
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatDate(request.endDate)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {request.status === "APPROVED" && (
                    <Button
                      onClick={() => handlePayNow(request.id)}
                      disabled={isRedirecting === request.id}
                      className="gap-2"
                    >
                      <CreditCard className="size-4" />
                      {isRedirecting === request.id
                        ? "Redirecting..."
                        : "Pay now"}
                    </Button>
                  )}
                  {request.status === "COMPLETED" && !isReviewedRequest && (
                    <Button
                      variant="outline"
                      onClick={() => handleOpenReview(request)}
                      className="gap-2 cursor-pointer"
                    >
                      <MessageSquarePlus className="size-4" />
                      Review
                    </Button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave a review</DialogTitle>
            <DialogDescription>
              Share your experience for this completed rental.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Rating
              </label>
              <Input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:border-primary"
                placeholder="Tell others about your stay"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setReviewOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit review"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MyRequests;
