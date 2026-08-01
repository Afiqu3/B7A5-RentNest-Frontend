"use server";

import { isAccessTokenExist } from "./refreshToken";

export const getMe = async () => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
    headers: {
      // Authorization : accessToken as unknown as string,
      // Authorization : `${accessToken}`,
      // Authorization : `Bearer ${accessToken}`

      Cookie: `accessToken=${accessToken}`,
    },

    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 24, // 1day
      tags: ["my-profile"],
    },
  });

  const result = await res.json();

  return result;
};
