import { getMe } from "@/service/getMe";
import { Metadata } from "next";
import MyProfile from "../_components/MyProfile";

export const metadata: Metadata = {
  title: "My Profile | RentNest",
  description: "View and update your RentNest account details.",
};

const LandlordDashboardPage = async () => {
  const user = await getMe();

  return (
    <div>
      <MyProfile user={user} />
    </div>
  );
};

export default LandlordDashboardPage;
