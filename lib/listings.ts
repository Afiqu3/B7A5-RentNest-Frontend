import type { PropertyField } from "@/lib/validations";

/**
 * Shared types and constants for the landlord listings feature.
 *
 * These live outside the `_actions` modules on purpose: a `"use server"` file
 * may only export async functions, so any constant or plain value has to be
 * declared here instead.
 */

/* -------------------------------------------------------------------------- */
/*                                  listings                                  */
/* -------------------------------------------------------------------------- */

export type MyListingCategory = {
  id: string;
  name: string;
};

export type MyListing = {
  id: string;
  title: string;
  description: string;
  location: string;
  image: string;
  address: string;
  /** The API returns this as a string ("45000"); normalise it in the UI. */
  rentAmount: number | string;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSquareFt: number | null;
  amenities: string[];
  status: string;
  landlordId: string;
  categoryId: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: MyListingCategory | null;
  landlord?: { name: string } | null;
};

export type ListingFieldErrors = Partial<Record<PropertyField, string[]>>;

export type ListingActionState = {
  success: boolean;
  message: string;
  errors?: ListingFieldErrors;
  listing?: MyListing | null;
  /**
   * Bumped on every result so the client can re-run its toast/close effect
   * even when two consecutive submissions return an identical message.
   */
  submittedAt?: number;
};

export const emptyListingState: ListingActionState = {
  success: false,
  message: "",
};

/* -------------------------------------------------------------------------- */
/*                                image upload                                */
/* -------------------------------------------------------------------------- */

/** Keep in sync with `serverActions.bodySizeLimit` in next.config.ts. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export type ImageUploadState = {
  success: boolean;
  message: string;
  url: string | null;
};
