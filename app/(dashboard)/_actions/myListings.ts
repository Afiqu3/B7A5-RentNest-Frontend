/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { isAccessTokenExist } from "@/service/refreshToken";

type PropertyState = {
  success: true;
  statusCode: number;
  message: string;
  data: Record<string, any>;
};

export const getMyListings = async (page = 1, limit = 10) => {
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
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 24, // 1day
        tags: ["my-properties"],
      },
    },
  );

  const result = await res.json();
  return result;
};

export const createListing = async (
  prevState: PropertyState,
  formData: FormData,
) => {
  const payload = {
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    location: String(formData.get("location")),
    address: String(formData.get("address")),
    rentAmount: Number(formData.get("rentAmount")),
    bedrooms: Number(formData.get("bedrooms")),
    bathrooms: Number(formData.get("bathrooms")),
    areaSquareFt: Number(formData.get("areaSquareFt")),
    amenities: (formData.get("amenities") as string).split(","),
    categoryId: String(formData.get("categoryId")),
  };

  const accessToken = await isAccessTokenExist();

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  return result;
};

export const getAllCategories = async () => {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 24, // 1day
      tags: ["category"],
    },
  });
  const result = await res.json();
  return result;
};

export const updateListing = async (
  propertyId: string,
  prevState: PropertyState,
  formData: FormData,
) => {
  // Helper to safely extract non-empty string values
  const getOptionalString = (key: string) => {
    const val = formData.get(key);
    return val && typeof val === "string" && val.trim() !== ""
      ? val
      : undefined;
  };

  // Helper to safely extract number values
  const getOptionalNumber = (key: string) => {
    const val = formData.get(key);
    if (!val || val === "") return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  };

  // Parse amenities safely
  const rawAmenities = formData.get("amenities");
  const amenities =
    typeof rawAmenities === "string" && rawAmenities.trim() !== ""
      ? rawAmenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      : undefined;

  // Construct payload with ONLY provided values (omits undefined key/values)
  const payload = Object.fromEntries(
    Object.entries({
      title: getOptionalString("title"),
      description: getOptionalString("description"),
      location: getOptionalString("location"),
      address: getOptionalString("address"),
      rentAmount: getOptionalNumber("rentAmount"),
      bedrooms: getOptionalNumber("bedrooms"),
      bathrooms: getOptionalNumber("bathrooms"),
      areaSquareFt: getOptionalNumber("areaSquareFt"),
      amenities,
      categoryId: getOptionalString("categoryId"),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }).filter(([_, value]) => value !== undefined),
  );

  const accessToken = await isAccessTokenExist();

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/properties/${propertyId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await res.json();
  return result;
};

export const deleteListing = async (propertyId: string) => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/properties/${propertyId}`,
    {
      method: "DELETE",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    },
  );
  
  const result = await res.json();
  return result;
};
