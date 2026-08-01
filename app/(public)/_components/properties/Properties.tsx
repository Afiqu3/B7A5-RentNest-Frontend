import Link from "next/link";
import { MapPinOff, SearchX, TriangleAlert } from "lucide-react";

import type { Property } from "@/lib/types";
import {
  buildPropertiesHref,
  getAvailableProperties,
  parsePropertyQuery,
} from "@/service/properties";
import { Button } from "@/components/ui/button";
import PropertyCard, { type PropertyPreview } from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import PropertyPagination from "./PropertyPagination";

const FALLBACK_IMAGE = "/images/banner-home.svg";

/**
 * `next/image` throws on any host missing from `images.remotePatterns` in
 * next.config.ts, and that throw would escape the Suspense boundary and take
 * the whole page down. Until the backend's image host is allow-listed there,
 * only same-origin paths are trusted.
 *
 * Once `remotePatterns` includes your CDN, this can just return `src`.
 */
function safeImage(src: string | null | undefined) {
  if (!src) return FALLBACK_IMAGE;
  return src.startsWith("/") ? src : FALLBACK_IMAGE;
}

/**
 * Maps an API property onto the shape `PropertyCard` renders, filling in
 * fallbacks for anything the backend doesn't return.
 */
function toPreview(property: Property): PropertyPreview {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    location: property.location,
    address: property.address,
    rentAmount: property.rentAmount,
    bedrooms: property.bedrooms ?? null,
    bathrooms: property.bathrooms ?? null,
    areaSquareFt: property.areaSquareFt ?? null,
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    status: property.status,
    image: safeImage(property.image ?? property.image),
    category: property.category.name,
  };
}

// type PropertiesProps = {
//   /**
//    * The page's `searchParams` promise, awaited here rather than in the page so
//    * only this subtree is request-time work.
//    */
//   searchParams: Promise<RawSearchParams>;
// };

export default async function Properties({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = parsePropertyQuery(await searchParams);

  const [result] = await Promise.all([getAvailableProperties(query)]);

  const { data: properties, meta } = result;
  const failed = !result.success;

  // An out-of-range ?page= returns an empty array even though the filters do
  // match — say so, and keep the pager visible so there's a way back.
  const pageOutOfRange =
    !failed && properties.length === 0 && meta.total > 0 && meta.page > 1;

  const currentHref = buildPropertiesHref({
    searchTerm: query.searchTerm,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
    sort: `${query.sortBy}:${query.sortOrder}`,
  });

  return (
    <div className="space-y-6">
      <PropertyFilters query={query} total={meta.total} />
      {failed ? (
        <EmptyState
          icon={TriangleAlert}
          title="We couldn't load properties right now."
          body="The listings service didn't respond. Give it a moment and try again — your filters are kept."
          action={
            <Button asChild variant="outline">
              <Link href={currentHref}>Retry</Link>
            </Button>
          }
        />
      ) : properties.length === 0 ? (
        <EmptyState
          icon={pageOutOfRange ? SearchX : MapPinOff}
          title={
            pageOutOfRange
              ? "That page is past the end of the results."
              : "No homes match these filters."
          }
          body={
            pageOutOfRange
              ? `There ${meta.total === 1 ? "is" : "are"} ${meta.total} matching ${
                  meta.total === 1 ? "home" : "homes"
                }, but not on this page. Jump back to the first page.`
              : "Try a different location, widen the rent range, or clear the filters to see everything that's available."
          }
          action={
            <Button asChild variant={pageOutOfRange ? "default" : "outline"}>
              <Link href={pageOutOfRange ? currentHref : "/properties"}>
                {pageOutOfRange ? "Back to page 1" : "Clear filters"}
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={toPreview(property)}
              delay={Math.min(index * 0.05, 0.3)}
            />
          ))}
        </div>
      )}

      {!failed && <PropertyPagination meta={meta} query={query} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 empty state                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="size-6" />
      </span>
      <h2 className="mt-5 font-heading text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {body}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
