import type { RentalRequestField } from "@/lib/validations";

/**
 * Shared types and constants for the public property-details feature.
 *
 * These live outside the `_action` module on purpose: a `"use server"` file
 * may only export async functions, so any constant or plain value has to be
 * declared here instead.
 */

export type PropertyLandlord = {
  name?: string;
  email?: string;
  phone?: string;
};

export type PropertyCategory = {
  id?: string;
  name: string;
};

export type PropertyDetail = {
  id: string;
  title: string;
  description: string;
  location: string;
  image: string;
  address: string;
  rentAmount: number | string;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSquareFt: number | null;
  amenities: string[];
  status: string;
  categoryId?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: PropertyCategory | null;
  landlord?: PropertyLandlord | null;
};

export type RentalRequestErrors = Partial<Record<RentalRequestField, string[]>>;

export type RentalRequestActionState = {
  success: boolean;
  message: string;
  errors?: RentalRequestErrors;
  /** Bumped on every result so the client can re-run its toast/close effect. */
  submittedAt?: number;
};

export const emptyRentalRequestState: RentalRequestActionState = {
  success: false,
  message: "",
};
