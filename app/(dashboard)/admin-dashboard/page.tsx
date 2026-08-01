import { Metadata } from "next";
import MyProfile from "../_components/MyProfile";
import { getMe } from "@/service/getMe";

export const metadata: Metadata = {
  title: "My Profile | RentNest",
  description: "View and update your RentNest account details.",
};
const AdminDashboardPage = async () => {
  const user = await getMe();
  return (
    <div>
      <MyProfile user={user} />
    </div>
  );
};

export default AdminDashboardPage;
