import type { Metadata } from "next";

import { getMe } from "@/service/getMe";
import MyProfile from "../_components/MyProfile";

export const metadata: Metadata = {
  title: "My Profile | RentNest",
  description: "View and update your RentNest account details.",
};

const ProfilePage = async () => {
  const user = await getMe();

  return <MyProfile user={user} />;
};

export default ProfilePage;
