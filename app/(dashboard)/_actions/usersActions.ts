"use server";

import { isAccessTokenExist } from "@/service/refreshToken";
import { revalidateTag } from "next/cache";

type ActiveStatus = "ACTIVE" | "BLOCKED";

export const getAllUsers = async (page = 1, limit = 10, search?: string) => {
  const accessToken = await isAccessTokenExist();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search: String(search),
  });

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/auth/users?${params}`,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },

      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 24, // 1day
        tags: ["users"],
      },
    },
  );

  const result = await res.json();

  return result;
};

export const updateUserActiveStatus = async (
  status: ActiveStatus,
  userId: string,
) => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/auth/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({ activeStatus: status }),
    },
  );

  const result = await res.json();

  revalidateTag("users", { expire: 0 });

  return result;
};
