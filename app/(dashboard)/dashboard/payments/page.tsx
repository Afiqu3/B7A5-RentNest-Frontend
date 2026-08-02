import { getPaymentHistory } from "../../_actions/paymentActions";
import Payments from "../../_components/payments/Payments";

const PaymentsPage = async () => {
  const result = await getPaymentHistory();

  return (
    <div className="space-y-6">
      <Payments payments={Array.isArray(result?.data) ? result.data : []} />
    </div>
  );
};

export default PaymentsPage;
