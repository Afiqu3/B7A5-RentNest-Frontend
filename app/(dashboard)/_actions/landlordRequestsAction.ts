"use server";

import { isAccessTokenExist } from "@/service/refreshToken";
import type { RequestActionState } from "@/lib/landlord-requests";

export const getAllLandlordRequests = async () => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/rentals/my-rental`,
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

export const updateRequestStatus = async (
  rentalId: string,
  _prevState: RequestActionState,
  formData: FormData,
): Promise<RequestActionState> => {
  void _prevState;

  const status = String(formData.get("status") ?? "");

  if (status !== "APPROVED" && status !== "REJECTED") {
    return {
      success: false,
      message: "Choose approve or reject.",
      status: null,
      submittedAt: Date.now(),
    };
  }

  try {
    const accessToken = await isAccessTokenExist();

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/rentals/${rentalId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      },
    );

    const result = await res.json().catch(() => null);

    if (!res.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "We couldn't update this request.",
        status: null,
        submittedAt: Date.now(),
      };
    }

    return {
      success: true,
      message:
        result.message ||
        (status === "APPROVED"
          ? "Request approved."
          : "Request rejected."),
      status,
      submittedAt: Date.now(),
    };
  } catch {
    return {
      success: false,
      message: "Unable to reach the server. Please try again.",
      status: null,
      submittedAt: Date.now(),
    };
  }
};
