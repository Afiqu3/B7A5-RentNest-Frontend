"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  CircleDollarSign,
  FileText,
  MapPin,
  Square,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type PropertyListingMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type PropertyListingItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  rentAmount: string | number;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSquareFt: number | null;
  amenities: string[];
  status: string;
  category: {
    name: string;
  } ;
  landlord: {
    name: string;
  };
};

type PropertyListingsProps = {
  properties: PropertyListingItem[];
  meta: PropertyListingMeta;
  currentPage: number;
  baseHref: string;
};

const statusStyles: Record<string, string> = {
  AVAILABLE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  RENTED: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  UNAVAILABLE: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  PENDING: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

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

const PropertyListings = ({
  properties,
  meta,
  currentPage,
  baseHref,
}: PropertyListingsProps) => {
  const totalPages = Math.max(meta.totalPages || 1, 1);
  const visiblePages = getVisiblePages(totalPages, currentPage);
  const showingFrom =
    properties.length === 0 ? 0 : (currentPage - 1) * meta.limit + 1;
  const showingTo =
    properties.length === 0 ? 0 : showingFrom + properties.length - 1;
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
              <Building2 className="size-4" />
              Property inventory
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Property listings overview
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Review each property, monitor availability, and keep the
                marketplace organized with a clean dashboard view.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <FileText className="size-4 text-primary" />
              {meta.total} properties found
            </div>
            <p className="mt-1">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Building2 className="size-6" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
            No properties available
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Properties will appear here once they are created or approved for
            the platform.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 xl:grid-cols-2">
            {properties.map((property, index) => (
              <motion.article
                key={property.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.25 }}
                className="group overflow-hidden rounded-3xl border border-border/70 bg-card/70 shadow-sm"
              >
                <div className="flex flex-col gap-4 p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[property.status] ?? "bg-muted text-muted-foreground border-border"}`}
                        >
                          {property.status}
                        </span>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {property.category?.name ?? "Property"}
                        </span>
                      </div>
                      <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                        {property.title}
                      </h2>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-right">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        Rent
                      </p>
                      <p className="font-heading text-lg font-semibold text-foreground">
                        {formatCurrency(property.rentAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserRound className="size-4 text-primary" />
                      <span>
                        Landlord: {property.landlord?.name ?? "Unknown"}
                      </span>
                    </div>
                    <p className="leading-6 text-muted-foreground/90">
                      {property.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                      <BedDouble className="size-3.5 text-primary" />
                      {property.bedrooms ?? "—"} bed
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                      <Bath className="size-3.5 text-primary" />
                      {property.bathrooms ?? "—"} bath
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                      <Square className="size-3.5 text-primary" />
                      {property.areaSquareFt?.toLocaleString() ?? "N/A"} sq ft
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {property.amenities.slice(0, 4).map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 4 && (
                      <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        +{property.amenities.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-border/70 pt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="size-4 text-primary" />
                      <span>{formatCurrency(property.rentAmount)} / month</span>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="group shrink-0"
                    >
                      <Link href={`/properties/${property.id}`}>
                        View details
                        <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {showingFrom}-{showingTo} of {meta.total} properties
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

export default PropertyListings;
