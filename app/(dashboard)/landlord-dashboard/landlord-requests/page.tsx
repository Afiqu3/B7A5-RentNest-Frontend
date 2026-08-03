import { Suspense } from "react";
import type { Metadata } from "next";

import type { LandlordRequest } from "@/lib/landlord-requests";
import { getAllLandlordRequests } from "../../_actions/landlordRequestsAction";
import LandlordRequests from "../../_components/landlord-requests/LandlordRequests";
import LandlordRequestsSkeleton from "../../_components/landlord-requests/LandlordRequestsSkeleton";

export const metadata: Metadata = {
  title: "Rental Requests | RentNest",
  description:
    "Review and respond to tenant rental requests for your RentNest properties.",
};

/**
 * Reads the landlord's cookie-scoped requests. Kept in its own component so the
 * route can still prerender a static shell (see `cacheComponents` in
 * next.config.ts) while this streams in.
 */
async function RequestsContent() {
  const result = await getAllLandlordRequests();

  const requests: LandlordRequest[] = Array.isArray(result?.data)
    ? result.data
    : [];

  return <LandlordRequests requests={requests} />;
}

const LandlordRequestsPage = () => {
  return (
    <Suspense fallback={<LandlordRequestsSkeleton />}>
      <RequestsContent />
    </Suspense>
  );
};

export default LandlordRequestsPage;
