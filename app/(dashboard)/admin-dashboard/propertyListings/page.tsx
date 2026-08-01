import { getAllProperties } from "../../_actions/propertyActions";
import PropertyListings from "../../_components/propertyListings/PropertyListings";

const PropertyListingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = Number.parseInt(
    Array.isArray(params.page) ? params.page[0] : (params.page ?? "1"),
    10,
  );
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;

  const result = await getAllProperties(safePage, 8);

  return (
    <div className="space-y-6">
      <PropertyListings
        properties={result?.data ?? []}
        meta={result?.meta ?? { page: 1, limit: 8, total: 0, totalPages: 1 }}
        currentPage={safePage}
        baseHref="/admin-dashboard/propertyListings"
      />
    </div>
  );
};

export default PropertyListingPage;
