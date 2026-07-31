import { getMe } from "@/service/getMe";
import DashboardNavbar from "./_components/DashboardNavbar";

const DashboardLayout = async () => {
  const user = await getMe();
  
  return (
    <div>
      <DashboardNavbar user={user} />
    </div>
  );
};

export default DashboardLayout;
