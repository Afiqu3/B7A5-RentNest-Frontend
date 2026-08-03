import { getAllCategory } from "../../_actions/reviewsActions";
import Reviews from "../../_components/reviews/Reviews";

const ReviewsPage = async () => {
  const result = await getAllCategory();
  const reviews = Array.isArray(result?.data) ? result.data : [];

  return <Reviews reviews={reviews} />;
};

export default ReviewsPage;
