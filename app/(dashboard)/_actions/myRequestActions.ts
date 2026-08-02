/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { isAccessTokenExist } from "@/service/refreshToken";

type ReviewState = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Record<string, any>;
};

export const getMyRequests = async () => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/rentals/my-request`,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-cache",
    },
  );

  const result = await res.json();

  return result;
};

export const getPaymentUrl = async (rentalId: string) => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/payments/checkout/${rentalId}`,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-cache",
    },
  );

  const result = await res.json();

  return result.transactionResult;
};

export const isReviewed = async (rentalId: string) => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/reviews/${rentalId}/exists`,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-cache",
    },
  );

  const result = await res.json();
  return result.data;
};

export const createReview = async (
  prevState: ReviewState,
  formData: FormData,
) => {
  void prevState;

  const rentalRequestId = formData.get("rentalRequestId")?.toString();

  if (!rentalRequestId) {
    return {
      success: false,
      statusCode: 400,
      message: "A rental request is required.",
      data: {},
    };
  }

  const payload = {
    rating: Number(formData.get("rating")),
    comment: String(formData.get("comment") || ""),
  };

  const accessToken = await isAccessTokenExist();

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/reviews/${rentalRequestId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await res.json().catch(() => ({}));

  return {
    success: Boolean(result?.success),
    statusCode: result?.statusCode ?? res.status,
    message: result?.message ?? "Unable to submit your review right now.",
    data: result?.data ?? {},
  };
};
