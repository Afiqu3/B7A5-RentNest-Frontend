"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { propertySchema } from "@/lib/validations";
import { isAccessTokenExist } from "@/service/refreshToken";
import type {
  ListingActionState,
  ListingFieldErrors,
  MyListing,
} from "@/lib/listings";

/* -------------------------------------------------------------------------- */
/*                                  helpers                                   */
/* -------------------------------------------------------------------------- */
/* Note: a "use server" module may only export async functions, so the shared
   types and constants for this feature live in `@/lib/listings`.             */

/** Pulls the property fields out of a FormData into a plain object. */
function readPropertyForm(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    address: formData.get("address"),
    rentAmount: formData.get("rentAmount"),
    bedrooms: formData.get("bedrooms"),
    bathrooms: formData.get("bathrooms"),
    areaSquareFt: formData.get("areaSquareFt"),
    amenities: formData.get("amenities"),
    categoryId: formData.get("categoryId"),
    image: formData.get("image"),
    status: formData.get("status"),
  };
}

function invalid(errors: ListingFieldErrors): ListingActionState {
  return {
    success: false,
    message: "Please fix the highlighted fields.",
    errors,
    submittedAt: Date.now(),
  };
}

/** Every cache tag that goes stale when a landlord's portfolio changes. */
function revalidateListings() {
  revalidateTag("my-properties", { expire: 0 });
  revalidateTag("properties", { expire: 0 });
}

/* -------------------------------------------------------------------------- */
/*                                   reads                                    */
/* -------------------------------------------------------------------------- */

/**
 * Fetches the signed-in landlord's own properties.
 *
 * Deliberately uncached: the response is scoped to the caller's cookie, and
 * Next's fetch cache keys on URL + options only — a shared entry would risk
 * serving one landlord's portfolio to another.
 */
export const getMyListings = async (page = 1, limit = 60) => {
  const accessToken = await isAccessTokenExist();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/properties/my-properties?${params}`,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    },
  );

  return res.json();
};

/* -------------------------------------------------------------------------- */
/*                                   writes                                   */
/* -------------------------------------------------------------------------- */

export const createListing = async (
  prevState: ListingActionState,
  formData: FormData,
): Promise<ListingActionState> => {
  void prevState;

  const parsed = propertySchema.safeParse(readPropertyForm(formData));

  if (!parsed.success) {
    return invalid(z.flattenError(parsed.error).fieldErrors);
  }

  const accessToken = await isAccessTokenExist();

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });

    const result = await res.json().catch(() => null);

    if (!res.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "We couldn't publish this listing.",
        submittedAt: Date.now(),
      };
    }

    revalidateListings();

    return {
      success: true,
      message: result.message || "Listing published successfully.",
      listing: (result.data as MyListing) ?? null,
      submittedAt: Date.now(),
    };
  } catch (error) {
    console.error("[listings] create failed:", error);
    return {
      success: false,
      message: "Unable to reach the server. Please try again.",
      submittedAt: Date.now(),
    };
  }
};

export const updateListing = async (
  propertyId: string,
  prevState: ListingActionState,
  formData: FormData,
): Promise<ListingActionState> => {
  void prevState;

  if (!propertyId) {
    return {
      success: false,
      message: "This listing could not be identified.",
      submittedAt: Date.now(),
    };
  }

  // The edit form ships every field pre-filled, so it's validated in full —
  // a blank input means the landlord cleared it, which is a real error rather
  // than "leave this one alone".
  const parsed = propertySchema.safeParse(readPropertyForm(formData));

  if (!parsed.success) {
    return invalid(z.flattenError(parsed.error).fieldErrors);
  }

  const accessToken = await isAccessTokenExist();

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/properties/${propertyId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
        body: JSON.stringify(parsed.data),
        cache: "no-store",
      },
    );

    const result = await res.json().catch(() => null);

    if (!res.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "We couldn't save these changes.",
        submittedAt: Date.now(),
      };
    }

    revalidateListings();

    return {
      success: true,
      message: result.message || "Listing updated successfully.",
      listing: (result.data as MyListing) ?? null,
      submittedAt: Date.now(),
    };
  } catch (error) {
    console.error("[listings] update failed:", error);
    return {
      success: false,
      message: "Unable to reach the server. Please try again.",
      submittedAt: Date.now(),
    };
  }
};

export const deleteListing = async (propertyId: string) => {
  if (!propertyId) {
    return { success: false, message: "This listing could not be identified." };
  }

  const accessToken = await isAccessTokenExist();

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/properties/${propertyId}`,
      {
        method: "DELETE",
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        cache: "no-store",
      },
    );

    const result = await res.json().catch(() => null);

    if (!res.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "We couldn't remove this listing.",
      };
    }

    revalidateListings();

    return {
      success: true,
      message: result.message || "Listing removed successfully.",
    };
  } catch (error) {
    console.error("[listings] delete failed:", error);
    return {
      success: false,
      message: "Unable to reach the server. Please try again.",
    };
  }
};
