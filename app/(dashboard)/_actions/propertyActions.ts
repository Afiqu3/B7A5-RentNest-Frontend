"use server";

import { isAccessTokenExist } from "@/service/refreshToken";

export const getAllProperties = async (page = 1, limit = 10) => {
  const accessToken = await isAccessTokenExist();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/properties?${params}`,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },

      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 24, // 1day
        tags: ["properties"],
      },
    },
  );

  const result = await res.json();

  return result;
};
