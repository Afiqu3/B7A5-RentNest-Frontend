import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { PropertyDetail } from "@/lib/property-details";
import { getMe } from "@/service/getMe";
import {
  getPropertyDetails,
  getPropertyDetailsForUser,
} from "../../_action/propertyDetails";
import PropertyDetails from "../../_components/propertyDetails/PropertyDetails";
import PropertyDetailsSkeleton from "../../_components/propertyDetails/PropertyDetailsSkeleton";

type PageParams = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getPropertyDetails(id);
  const property = result?.data as PropertyDetail | undefined;

  if (!property?.title) {
    return { title: "Property | RentNest" };
  }

  return {
    title: `${property.title} | RentNest`,
    description:
      property.description?.slice(0, 155) ??
      "View this rental property on RentNest.",
  };
}

/**
 * Reads the session and the property. Kept in its own component so the route
 * can still prerender a static shell (see `cacheComponents` in next.config.ts)
 * while this streams in.
 */
async function DetailsContent({ id }: { id: string }) {
  const me = await getMe();
  const isLoggedIn = Boolean(me?.success && me?.data?.id);

  // Signed-in visitors get the richer, landlord-inclusive payload.
  const result = isLoggedIn
    ? await getPropertyDetailsForUser(id)
    : await getPropertyDetails(id);

  const property = result?.data as PropertyDetail | undefined;

  if (!result?.success || !property?.id) {
    notFound();
  }

  const viewer = isLoggedIn
    ? { id: me.data.id as string, role: String(me.data.role ?? "") }
    : null;

  return (
    <PropertyDetails
      property={property}
      isLoggedIn={isLoggedIn}
      viewer={viewer}
      redirectTo={`/properties/${id}`}
    />
  );
}

const PropertyDetailsPage = async ({ params }: { params: PageParams }) => {
  const { id } = await params;

  return (
    <Suspense fallback={<PropertyDetailsSkeleton />}>
      <DetailsContent id={id} />
    </Suspense>
  );
};

export default PropertyDetailsPage;
