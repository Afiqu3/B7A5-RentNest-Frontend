import { getReviews } from "../../_action/actions";
import ReviewCarousel from "./ReviewCarousel";

export default async function ReviewList() {
  const reviews = await getReviews();

  if (reviews.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        No reviews yet, check back soon.
      </p>
    );
  }

  return <ReviewCarousel reviews={reviews} />;
}
