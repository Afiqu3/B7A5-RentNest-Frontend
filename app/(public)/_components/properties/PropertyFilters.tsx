"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpDown,
  Loader2,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { PropertyCategory, PropertyQuery } from "@/lib/types";
import {
  buildPropertiesHref,
  DEFAULT_SORT,
  PROPERTY_SORT_OPTIONS,
} from "@/service/properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_CATEGORIES = "all";
const DEBOUNCE_MS = 450;

/** The fields that are typed into, as opposed to picked from a menu. */
type Draft = {
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
};

/** Non-draft changes that accompany a navigation. */
type Extras = {
  categoryId?: string;
  sort?: string;
};

type PropertyFiltersProps = {
  query: PropertyQuery;
  categories: PropertyCategory[];
  /** Total matches for the current query, shown in the summary row. */
  total: number;
};

function sameDraft(a: Draft, b: Draft) {
  return (
    a.searchTerm === b.searchTerm &&
    a.minPrice === b.minPrice &&
    a.maxPrice === b.maxPrice
  );
}

/** Strips everything but digits so a pasted "৳12,000" still works. */
function digitsOnly(value: string) {
  return value.replace(/[^\d]/g, "");
}

/**
 * Renders a rent range low-to-high, matching how the request is sent even if
 * the visitor happened to type the bounds the other way round.
 */
function priceRangeLabel(min: string, max: string) {
  const reversed = min !== "" && max !== "" && Number(min) > Number(max);
  const low = reversed ? max : min;
  const high = reversed ? min : max;
  return `${low || "0"} – ${high || "any"}`;
}

/**
 * Matches what `parsePropertyQuery` will read back out of the URL. Recording
 * the normalised form as "what we pushed" is what stops the round-trip from
 * clobbering a field the visitor is still typing into.
 */
function normalize(draft: Draft): Draft {
  return {
    searchTerm: draft.searchTerm.trim(),
    minPrice: digitsOnly(draft.minPrice),
    maxPrice: digitsOnly(draft.maxPrice),
  };
}

export default function PropertyFilters({
  query,
  categories,
  total,
}: PropertyFiltersProps) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const sort = `${query.sortBy}:${query.sortOrder}`;

  const incoming: Draft = {
    searchTerm: query.searchTerm,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
  };

  // Typed fields are held locally and pushed to the URL on a debounce, so
  // typing stays responsive while the URL remains the source of truth.
  const [draft, setDraft] = React.useState<Draft>(incoming);
  // The last URL value we observed, and the last value we ourselves sent.
  const [seen, setSeen] = React.useState<Draft>(incoming);
  const [pushed, setPushed] = React.useState<Draft>(incoming);

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Adopt URL values that changed for a reason other than our own push — back
  // and forward navigation, mainly. Adjusting state during render is React's
  // supported alternative to a syncing effect.
  if (!sameDraft(seen, incoming)) {
    setSeen(incoming);
    if (!sameDraft(pushed, incoming)) {
      setDraft(incoming);
      setPushed(incoming);
    }
  }

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // If the URL changes for a reason this component didn't cause — a pagination
  // link, most likely — drop any pending debounce. Otherwise the stale push
  // would fire a moment later and silently undo that navigation.
  React.useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [query.page, query.categoryId, query.sortBy, query.sortOrder]);

  const navigate = (next: Draft, extras: Extras = {}) => {
    startTransition(() => {
      router.replace(
        buildPropertiesHref({
          ...normalize(next),
          categoryId: extras.categoryId ?? query.categoryId,
          sort: extras.sort ?? sort,
          // Any filter change invalidates the current offset.
          page: 1,
        }),
        { scroll: false },
      );
    });
  };

  /** Navigate immediately, cancelling any pending debounce. */
  const commit = (next: Draft, extras: Extras = {}) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDraft(next);
    setPushed(normalize(next));
    navigate(next, extras);
  };

  /** Update a typed field and schedule the push. */
  const setField = (field: keyof Draft, value: string) => {
    const next = { ...draft, [field]: value };
    setDraft(next);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPushed(normalize(next));
      navigate(next);
    }, DEBOUNCE_MS);
  };

  const activeCategory = categories.find(
    (category) => category.id === query.categoryId,
  );

  const activeCount =
    (query.searchTerm ? 1 : 0) +
    (query.categoryId ? 1 : 0) +
    (query.minPrice || query.maxPrice ? 1 : 0);

  const clearAll = () =>
    commit(
      { searchTerm: "", minPrice: "", maxPrice: "" },
      { categoryId: "", sort: DEFAULT_SORT },
    );

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      aria-label="Property filters"
      className="rounded-3xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-sm sm:p-5"
    >
      {/* ----------------------------- primary row ---------------------------- */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={draft.searchTerm}
            onChange={(event) => setField("searchTerm", event.target.value)}
            placeholder="Search by location — e.g. Dhanmondi, Chattogram"
            aria-label="Search properties by location"
            className="h-11 pr-11 pl-11"
          />
          <AnimatePresence>
            {pending && (
              <motion.span
                role="status"
                aria-label="Updating results"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground"
              >
                <Loader2 className="size-4 animate-spin" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {/* Labelled via a hidden node so screen readers hear both the label
              and the selected option, which a plain aria-label would hide. */}
          <span id="sort-label" className="sr-only">
            Sort properties by
          </span>
          <Select
            value={sort}
            onValueChange={(value) => commit(draft, { sort: value })}
          >
            <SelectTrigger
              id="sort-trigger"
              aria-labelledby="sort-label sort-trigger"
              className="h-11 w-full min-w-44 lg:w-auto"
            >
              <ArrowUpDown className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent align="end">
              {PROPERTY_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdvanced((open) => !open)}
            aria-expanded={showAdvanced}
            className="h-11 shrink-0"
          >
            <SlidersHorizontal
              className={cn(
                "transition-transform duration-300",
                showAdvanced && "rotate-90",
              )}
            />
            Filters
            {activeCount > 0 && (
              <span className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* ---------------------------- advanced panel --------------------------- */}
      <AnimatePresence initial={false}>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid gap-4 border-t border-border/70 pt-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.length > 0 && (
                <div className="grid gap-2">
                  <Label htmlFor="filter-category" className="text-xs">
                    Category
                  </Label>
                  <Select
                    value={query.categoryId || ALL_CATEGORIES}
                    onValueChange={(value) =>
                      commit(draft, {
                        categoryId: value === ALL_CATEGORIES ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger id="filter-category" className="h-10 w-full">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_CATEGORIES}>
                        All categories
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="filter-min-price" className="text-xs">
                  Min rent
                </Label>
                <Input
                  id="filter-min-price"
                  inputMode="numeric"
                  value={draft.minPrice}
                  onChange={(event) =>
                    setField("minPrice", digitsOnly(event.target.value))
                  }
                  placeholder="0"
                  className="h-10"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="filter-max-price" className="text-xs">
                  Max rent
                </Label>
                <Input
                  id="filter-max-price"
                  inputMode="numeric"
                  value={draft.maxPrice}
                  onChange={(event) =>
                    setField("maxPrice", digitsOnly(event.target.value))
                  }
                  placeholder="Any"
                  className="h-10"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------ chips row ------------------------------ */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
        <p
          aria-live="polite"
          className="mr-1 text-sm font-medium text-muted-foreground"
        >
          {total} {total === 1 ? "home" : "homes"} found
        </p>

        <AnimatePresence mode="popLayout">
          {query.searchTerm && (
            <Chip
              key="search"
              label={`Location: ${query.searchTerm}`}
              onClear={() => commit({ ...draft, searchTerm: "" })}
            />
          )}

          {activeCategory && (
            <Chip
              key="category"
              label={activeCategory.name}
              onClear={() => commit(draft, { categoryId: "" })}
            />
          )}

          {(query.minPrice || query.maxPrice) && (
            <Chip
              key="price"
              // Shown low-to-high to match how the request is actually sent.
              label={`Rent ${priceRangeLabel(query.minPrice, query.maxPrice)}`}
              onClear={() => commit({ ...draft, minPrice: "", maxPrice: "" })}
            />
          )}
        </AnimatePresence>

        {(activeCount > 0 || sort !== DEFAULT_SORT) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
    </motion.section>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.18 }}
      className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-muted/60 py-1 pr-1 pl-3 text-xs font-medium text-foreground"
    >
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onClear}
        aria-label={`Remove filter: ${label}`}
        className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        <X className="size-3" />
      </button>
    </motion.span>
  );
}
