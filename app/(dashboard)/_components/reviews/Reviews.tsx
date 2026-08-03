"use client";

import { motion } from "motion/react";
import {
  CalendarDays,
  MessageSquareQuote,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

type ReviewItem = {
  id: string;
  rating: number;
  comment: string;
  tenantId: string;
  propertyId: string;
  rentalRequestId: string;
  createdAt: string;
  updatedAt: string;
};

type ReviewsProps = {
  reviews: ReviewItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

const Reviews = ({ reviews }: ReviewsProps) => {
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

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
              <TrendingUp className="size-4" />
              Landlord reviews
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Hear how your guests feel about their stay
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Review feedback from tenants, spot trends, and keep your hosting
                experience shining.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="size-4 text-primary" />
              {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </div>
            <p className="mt-1">Average rating {averageRating}/5</p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <MessageSquareQuote className="size-6" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
            No reviews yet
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Reviews from completed stays will appear here once tenants share
            their feedback.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
              className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    <Star className="size-3.5 fill-current" />
                    {review.rating}/5 rating
                  </div>
                  <h2 className="mt-3 font-heading text-lg font-semibold text-foreground">
                    Tenant feedback
                  </h2>
                </div>
                <div className="rounded-2xl bg-background/80 p-3 text-muted-foreground">
                  <MessageSquareQuote className="size-5" />
                </div>
              </div>

              <p className="mt-4 rounded-2xl border border-border/60 bg-background/70 p-4 text-sm leading-6 text-muted-foreground">
                “{review.comment || "No comment provided."}”
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">Tenant ID</p>
                  <p className="mt-1 text-sm font-medium text-foreground break-all">
                    {review.tenantId}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">Property ID</p>
                  <p className="mt-1 text-sm font-medium text-foreground break-all">
                    {review.propertyId}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5">
                  <CalendarDays className="size-4 text-primary" />
                  {formatDate(review.createdAt)}
                </div>
                <div className="rounded-full border border-border/60 bg-background/70 px-3 py-1.5">
                  Request ID: {review.rentalRequestId.slice(0, 8)}...
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Reviews;
