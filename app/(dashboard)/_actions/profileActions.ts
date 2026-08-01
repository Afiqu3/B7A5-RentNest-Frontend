"use server";

import { z } from "zod";

import type { ProfileFormState } from "@/lib/types";
import { updateProfileSchema } from "@/lib/validations";
import { revalidateTag } from "next/cache";
import { isAccessTokenExist } from "@/service/refreshToken";

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

  const accessToken = await isAccessTokenExist();
  console.log(accessToken);

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/auth/my-profile`,
    {
      method: "PATCH",
      headers: {
        Cookie: `accessToken=${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    },
  );

  const result = await res.json();
  if (result.success) {
    revalidateTag("my-profile", { expire: 0 });
  }
  return result;
};
