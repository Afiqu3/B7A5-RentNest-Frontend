import { getAllRentalRequests } from "../../_actions/rentalRequestActions";
import RentalRequests from "../../_components/requests/RentalRequests";

const RentalRequestsPage = async ({
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

  const result = await getAllRentalRequests(safePage, 8);

  return (
    <div className="space-y-6">
      <RentalRequests
        rentals={result?.data ?? []}
        meta={result?.meta ?? { page: 1, limit: 10, total: 0, totalPages: 1 }}
        currentPage={safePage}
        baseHref="/admin-dashboard/requests"
      />
    </div>
  );
};

export default RentalRequestsPage;
