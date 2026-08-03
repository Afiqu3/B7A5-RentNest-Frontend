/**
 * Shared types and constants for the landlord rental-requests feature.
 *
 * These live outside the `_actions` module on purpose: a `"use server"` file
 * may only export async functions, so any constant or plain value has to be
 * declared here instead.
 */

export type RequestTenant = {
  name: string;
  email: string;
  phone: string;
};

export type RequestProperty = {
  id: string;
  title: string;
  location: string;
  address: string;
  image: string;
  rentAmount: number | string;
  status: string;
};

export type LandlordRequest = {
  id: string;
  status: string;
  moveInDate: string;
  durationMonths: number;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  property: RequestProperty;
  tenant: RequestTenant;
};

/** The decisions a landlord can make on a pending request. */
export type RequestDecision = "APPROVED" | "REJECTED";

export type RequestActionState = {
  success: boolean;
  message: string;
  /** The decision that was applied, echoed back on success. */
  status: RequestDecision | null;
  /** Bumped on every result so the client can re-run its toast effect. */
  submittedAt?: number;
};

export const emptyRequestState: RequestActionState = {
  success: false,
  message: "",
  status: null,
};
