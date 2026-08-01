import { getAllUsers } from "../../_actions/usersActions";
import Users from "../../_components/users/Users";

const UsersPage = async (props: {
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}) => {
  const params = await props.searchParams;
  const page = Number.parseInt(
    Array.isArray(params?.page) ? params.page[0] : (params?.page ?? "1"),
    10,
  );
  const search = Array.isArray(params?.search)
    ? params.search[0]
    : (params?.search ?? "");

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const result = await getAllUsers(safePage, 8, search);

  return (
    <div className="space-y-6">
      <Users
        users={result?.data ?? []}
        meta={result?.meta ?? { page: 1, limit: 8, total: 0, totalPages: 1 }}
        currentPage={safePage}
        baseHref="/admin-dashboard/users"
      />
    </div>
  );
};

export default UsersPage;
