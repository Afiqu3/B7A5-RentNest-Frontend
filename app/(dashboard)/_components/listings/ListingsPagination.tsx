"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type ListingsPaginationProps = {
  currentPage: number;
  totalPages: number;
  total: number;
  /** How many rows are rendered on this page. */
  showing: number;
  limit: number;
  baseHref: string;
};

/**
 * Builds a compact page list: first, last, the current page and its
 * neighbours, with "…" standing in for the gaps.
 */
function pageItems(current: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([
    1,
    totalPages,
    current,
    current - 1,
    current + 1,
  ]);

  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items: (number | "gap")[] = [];
  let previous = 0;

  for (const page of sorted) {
    if (previous && page - previous > 1) items.push("gap");
    items.push(page);
    previous = page;
  }

  return items;
}

export function buildListingsHref(baseHref: string, page: number) {
  return page > 1 ? `${baseHref}?page=${page}` : baseHref;
}

const ListingsPagination = ({
  currentPage,
  totalPages,
  total,
  showing,
  limit,
  baseHref,
}: ListingsPaginationProps) => {
  // if (totalPages <= 1) return null;

  const from = showing === 0 ? 0 : (currentPage - 1) * limit + 1;
  const to = from === 0 ? 0 : from + showing - 1;

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Listings pagination"
      className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-border/70 bg-card/60 p-4 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {from}-{to}
        </span>{" "}
        of <span className="font-medium text-foreground">{total}</span>{" "}
        {total === 1 ? "listing" : "listings"}
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          asChild={hasPrevious}
          variant="outline"
          size="icon"
          disabled={!hasPrevious}
          aria-label="Previous page"
        >
          {hasPrevious ? (
            <Link
              href={buildListingsHref(baseHref, currentPage - 1)}
              scroll={false}
            >
              <ChevronLeft />
            </Link>
          ) : (
            <ChevronLeft />
          )}
        </Button>

        {pageItems(currentPage, totalPages).map((item, index) =>
          item === "gap" ? (
            <span
              key={`gap-${index}`}
              aria-hidden
              className="px-1 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              asChild
              size="icon"
              variant={item === currentPage ? "default" : "outline"}
              aria-current={item === currentPage ? "page" : undefined}
            >
              <Link href={buildListingsHref(baseHref, item)} scroll={false}>
                {item}
              </Link>
            </Button>
          ),
        )}

        <Button
          asChild={hasNext}
          variant="outline"
          size="icon"
          disabled={!hasNext}
          aria-label="Next page"
        >
          {hasNext ? (
            <Link
              href={buildListingsHref(baseHref, currentPage + 1)}
              scroll={false}
            >
              <ChevronRight />
            </Link>
          ) : (
            <ChevronRight />
          )}
        </Button>
      </div>
    </nav>
  );
};

export default ListingsPagination;
