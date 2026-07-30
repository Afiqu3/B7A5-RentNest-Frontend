"use server";

export type Review = {
  id: string;
  reviewerName: string;
  reviewerRole: "Tenant" | "Landlord";
  location: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
};

/**
 * Fetches the reviews shown on the homepage.
 *
 * This currently returns mock data so the UI can be built and reviewed ahead
 * of the backend endpoint. Once the reviews API is live, swap the body for a
 * real request, e.g.:
 *
 * const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?featured=true`, {
 *   next: { tags: ["reviews"] },
 * });
 * if (!res.ok) throw new Error("Failed to load reviews");
 * return (await res.json()) as Review[];
 */
export async function getReviews(): Promise<Review[]> {
  return MOCK_REVIEWS;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "review-1",
    reviewerName: "Amelia Chowdhury",
    reviewerRole: "Tenant",
    location: "Dhaka",
    rating: 5,
    comment:
      "Booking through RentNest was refreshingly simple. Every listing matched what I saw in person, and the support team helped me move in within a week.",
  },
  {
    id: "review-2",
    reviewerName: "Rafiul Islam",
    reviewerRole: "Landlord",
    location: "Chattogram",
    rating: 5,
    comment:
      "Managing my rentals used to take hours of back and forth. The dashboard keeps every request, payment, and tenant message organized in one place.",
  },
  {
    id: "review-3",
    reviewerName: "Nusrat Jahan",
    reviewerRole: "Tenant",
    location: "Sylhet",
    rating: 4,
    comment:
      "I loved how transparent the pricing was, no hidden fees at checkout. Scheduling a viewing took less than a minute.",
  },
  {
    id: "review-4",
    reviewerName: "Nusrat Jahan",
    reviewerRole: "Tenant",
    location: "Sylhet",
    rating: 4,
    comment:
      "I loved how transparent the pricing was, no hidden fees at checkout. Scheduling a viewing took less than a minute.",
  },
];
