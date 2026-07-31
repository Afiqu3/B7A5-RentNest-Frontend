"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const logout = async () => {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/logout`, {
    method: "POST",
  });

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  revalidateTag("my-profile", {
    expire: 0,
  });

  const result = await res.json();
  return result;
};
