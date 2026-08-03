import { Suspense } from "react";
import type { Metadata } from "next";

import type {
  MyListing as MyListingType,
  MyListingCategory,
} from "@/lib/listings";
import { getAllCategory } from "../../_actions/categoryActions";
import { getMyListings } from "../../_actions/myListings";
import MyListing from "../../_components/listings/MyListing";
import MyListingSkeleton from "../../_components/listings/MyListingSkeleton";

export const metadata: Metadata = {
  title: "My Listings | RentNest",
  description:
    "Create, update, and remove the rental properties in your RentNest portfolio.",
};

const BASE_HREF = "/landlord-dashboard/listings";
const PAGE_SIZE = 9;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * Reads the landlord's cookie-scoped data. Kept in its own component so the
 * route can still prerender a static shell (see `cacheComponents` in
 * next.config.ts) while this streams in.
 */
async function ListingsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const raw = Array.isArray(params.page) ? params.page[0] : (params.page ?? "1");
  const parsed = Number.parseInt(raw, 10);
  const currentPage = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;

  // `getAllCategory` (not a local copy) is used deliberately: the categories
  // endpoint is authenticated, and that action forwards the access token.
  const [listingsResult, categoriesResult] = await Promise.all([
    getMyListings(currentPage, PAGE_SIZE),
    getAllCategory(),
  ]);

  const listings: MyListingType[] = Array.isArray(listingsResult?.data)
    ? listingsResult.data
    : [];

  const categories: MyListingCategory[] = Array.isArray(categoriesResult?.data)
    ? categoriesResult.data
        // Soft-deleted categories must not be offered on new listings.
        .filter(
          (category: MyListingCategory & { deletedAt?: string | null }) =>
            !category.deletedAt,
        )
        .map((category: MyListingCategory) => ({
          id: category.id,
          name: category.name,
        }))
    : [];

  // If the endpoint ever omits `meta`, fall back to what this page can prove:
  // a full page implies there may be another, an empty one implies there isn't.
  const meta = listingsResult?.meta ?? {
    page: currentPage,
    limit: PAGE_SIZE,
    total: (currentPage - 1) * PAGE_SIZE + listings.length,
    totalPages: listings.length === PAGE_SIZE ? currentPage + 1 : currentPage,
  };

  return (
    <MyListing
      listings={listings}
      categories={categories}
      meta={meta}
      currentPage={currentPage}
      baseHref={BASE_HREF}
    />
  );
}

const ListingPage = ({ searchParams }: { searchParams: SearchParams }) => {
  return (
    <Suspense fallback={<MyListingSkeleton />}>
      <ListingsContent searchParams={searchParams} />
    </Suspense>
  );
};

export default ListingPage;
