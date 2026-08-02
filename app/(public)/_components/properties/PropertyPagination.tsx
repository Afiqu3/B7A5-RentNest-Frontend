import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ApiMeta, PropertyQuery } from "@/lib/types";
import { buildPropertiesHref } from "@/service/properties";

type PropertyPaginationProps = {
  meta: ApiMeta;
  query: PropertyQuery;
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

export default function PropertyPagination({
  meta,
  query,
}: PropertyPaginationProps) {
  const { page, totalPages } = meta;

  // if (totalPages <= 1) return null;

  const hrefFor = (target: number) =>
    buildPropertiesHref({
      searchTerm: query.searchTerm,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      sort: `${query.sortBy}:${query.sortOrder}`,
      page: target,
    });

  const items = pageItems(page, totalPages);
  const linkBase =
    "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-full border border-border px-3 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

  return (
    <nav
      aria-label="Property pagination"
      className="mt-10 flex flex-col items-center gap-4"
    >
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {page > 1 ? (
            <Link
              href={hrefFor(page - 1)}
              rel="prev"
              aria-label="Previous page"
              className={cn(linkBase, "bg-background hover:bg-muted")}
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">Prev</span>
            </Link>
          ) : (
            <span
              aria-hidden
              className={cn(
                linkBase,
                "pointer-events-none bg-background opacity-40",
              )}
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">Prev</span>
            </span>
          )}
        </li>

        {items.map((item, index) =>
          item === "gap" ? (
            <li
              key={`gap-${index}`}
              aria-hidden
              className="px-1 text-sm text-muted-foreground select-none"
            >
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefFor(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  linkBase,
                  item === page
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "bg-background hover:bg-muted",
                )}
              >
                {item}
              </Link>
            </li>
          ),
        )}

        <li>
          {page < totalPages ? (
            <Link
              href={hrefFor(page + 1)}
              rel="next"
              aria-label="Next page"
              className={cn(linkBase, "bg-background hover:bg-muted")}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span
              aria-hidden
              className={cn(
                linkBase,
                "pointer-events-none bg-background opacity-40",
              )}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="size-4" />
            </span>
          )}
        </li>
      </ul>

      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} · {meta.total} total
      </p>
    </nav>
  );
}
