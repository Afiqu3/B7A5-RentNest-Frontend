"use server";

import { isAccessTokenExist } from "@/service/refreshToken";

export const getOverviewData = async () => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/overview`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },

    cache: "no-cache",
  });

  const result = await res.json();

  return result;
};
