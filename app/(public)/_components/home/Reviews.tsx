import { Suspense } from "react";

import ReviewList from "../reviews/ReviewList";
import ReviewsHeader from "../reviews/ReviewsHeader";

function ReviewListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[28px] border border-border bg-card/70 p-6 shadow-sm"
        >
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div className="mt-3 h-4 w-24 rounded-full bg-muted" />
          <div className="mt-4 h-4 w-full rounded bg-muted" />
          <div className="mt-2 h-4 w-5/6 rounded bg-muted" />
          <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
          <div className="mt-6 flex items-center gap-3 border-t border-border/70 pt-4">
            <div className="size-9 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ReviewsHeader />

        <div className="mt-10">
          <Suspense fallback={<ReviewListSkeleton />}>
            <ReviewList />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
