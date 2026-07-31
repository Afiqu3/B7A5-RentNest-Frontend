"use server";

import { z } from "zod";

import type { ProfileFormState } from "@/lib/types";
import { updateProfileSchema } from "@/lib/validations";

/**
 * Updates the signed-in user's profile.
 *
 * TODO(backend): this is a stub. Once the profile endpoint is live, replace the
 * mocked block below with the real request, e.g.
 *
 *   import { cookies } from "next/headers";
 *   import { revalidateTag } from "next/cache";
 *
 *   const accessToken = (await cookies()).get("accessToken")?.value;
 *   if (!accessToken) return { success: false, message: "Not authenticated." };
 *
 *   const res = await fetch(`${process.env.BACKEND_API_URL}/api/user/me`, {
 *     method: "PATCH",
 *     headers: {
 *       "Content-Type": "application/json",
 *       Cookie: `accessToken=${accessToken}`,
 *     },
 *     body: JSON.stringify(parsed.data),
 *     cache: "no-store",
 *   });
 *
 *   const result = await res.json();
 *   if (result.success) revalidateTag("my-profile", { expire: 0 });
 *   return result;
 *
 * `getMe` caches under the "my-profile" tag for 24h, so the revalidateTag call
 * is required or the dashboard will keep showing stale values.
 */
export const updateProfileAction = async (
  prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> => {
  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  // ---- MOCK: remove once the endpoint exists -------------------------------
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    message: "Profile updated successfully.",
    data: parsed.data,
  };
  // --------------------------------------------------------------------------
};
