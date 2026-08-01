import { getOverviewData } from "../../_actions/overviewActions";
import Overview from "../../_components/overview/Overview";

const OverviewPage = async () => {
  const result = await getOverviewData();

  return (
    <div className="space-y-6">
      <Overview stats={result?.data ?? {}} />
    </div>
  );
};

export default OverviewPage;
