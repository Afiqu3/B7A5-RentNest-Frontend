import { getAllCategory } from "../../_actions/landlordOverviewActions";
import LandlordOverview from "../../_components/landlordOverview/LandlordOverview";

const LandlordOverviewPage = async () => {
  const result = await getAllCategory();
  const stats = result?.data ?? {
    totalProperties: 0,
    totalActiveRequests: 0,
  };

  return <LandlordOverview stats={stats} />;
};

export default LandlordOverviewPage;
