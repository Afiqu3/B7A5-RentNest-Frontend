import { getMyRequests } from "../../_actions/myRequestActions";
import MyRequests from "../../_components/my-requests/MyRequests";

const MyRequestsPage = async () => {
  const result = await getMyRequests();

  return (
    <div className="space-y-6">
      <MyRequests requests={Array.isArray(result?.data) ? result.data : []} />
    </div>
  );
};

export default MyRequestsPage;
