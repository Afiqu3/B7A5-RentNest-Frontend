import { Suspense } from "react";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import Properties from "../_components/properties/Properties";
import PropertiesSkeleton from "../_components/properties/PropertiesSkeleton";

export const metadata: Metadata = {
  title: "Browse Properties | RentNest",
  description:
    "Search available rentals by location, filter by category and rent, and find your next home on RentNest.",
};

const PropertiesPage = ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 right-1/2 size-80 translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 size-64 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="size-4 text-primary" />
            Every available home
          </span>
          <h1 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Find a place that feels like yours.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Search by location, narrow it down by category and rent, and sort
            the results however you like.
          </p>
        </header>

        <div className="mt-10 lg:mt-12">
          {/*
            `searchParams` is awaited inside <Properties>, not here — under
            cacheComponents that keeps the header above as a static shell while
            the filtered results stream in per request.
          */}
          <Suspense fallback={<PropertiesSkeleton />}>
            <Properties searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
