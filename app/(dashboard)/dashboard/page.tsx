import { getMe } from "@/service/getMe";
import MyProfile from "../_components/MyProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | RentNest",
  description: "View and update your RentNest account details.",
};

const DashboardPage = async () => {
  const user = await getMe();

  return (
    <div>
      <MyProfile user={user} />
    </div>
  );
};

export default DashboardPage;
