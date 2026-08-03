"use server";

import { z } from "zod";

import { rentalRequestSchema } from "@/lib/validations";
import type { RentalRequestActionState } from "@/lib/property-details";
import { isAccessTokenExist } from "@/service/refreshToken";

/** Public details — no auth, and (soon) no landlord contact info. */
export const getPropertyDetails = async (propertyId: string) => {
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/properties/${propertyId}`,
    {
      cache: "no-cache",
    },
  );

  return res.json();
};

/** Full details for a signed-in user, including landlord contact info. */
export const getPropertyDetailsForUser = async (propertyId: string) => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/properties/${propertyId}/user`,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-cache",
    },
  );

  return res.json();
};

export const requestRental = async (
  propertyId: string,
  userId: string,
  _prevState: RentalRequestActionState,
  formData: FormData,
): Promise<RentalRequestActionState> => {
  void _prevState;

  const parsed = rentalRequestSchema.safeParse({
    moveInDate: formData.get("moveInDate"),
    durationMonths: formData.get("durationMonths"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors,
      submittedAt: Date.now(),
    };
  }

  const payload = {
    propertyId,
    tenantId: userId,
    // Send a full ISO timestamp so the backend gets an unambiguous instant.
    moveInDate: new Date(parsed.data.moveInDate).toISOString(),
    durationMonths: parsed.data.durationMonths,
  };

  try {
    const accessToken = await isAccessTokenExist();

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/rentals/${propertyId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    const result = await res.json().catch(() => null);

    if (!res.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "We couldn't submit your request.",
        submittedAt: Date.now(),
      };
    }

    return {
      success: true,
      message: result.message || "Rental request submitted.",
      submittedAt: Date.now(),
    };
  } catch {
    return {
      success: false,
      message: "Unable to reach the server. Please try again.",
      submittedAt: Date.now(),
    };
  }
};
