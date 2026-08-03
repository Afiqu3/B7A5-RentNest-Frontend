import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .regex(/^[+()\d\s-]+$/, "Enter a valid phone number"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  role: z.enum(["TENANT", "LANDLORD"], { error: "Please select a role" }),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s-]+$/, "Enter a valid phone number")
    // Count digits rather than characters so "++++++++++" is rejected.
    .refine(
      (value) => (value.match(/\d/g)?.length ?? 0) >= 10,
      "Enter a valid phone number",
    ),
});

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be at most 50 characters"),
});

/* -------------------------------------------------------------------------- */
/*                                  property                                  */
/* -------------------------------------------------------------------------- */

/**
 * `FormData` hands us strings for everything. These preprocessors normalise a
 * raw form value into the shape the schema below expects, while deliberately
 * leaving unparseable input as-is so zod reports a type error instead of
 * silently coercing "abc" into `NaN` or `0`.
 */
const toNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return value;

  const trimmed = value.trim().replace(/,/g, "");
  if (trimmed === "") return undefined;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : value;
};

/** Accepts a real array (JS callers) or the comma-joined string a form posts. */
const toStringArray = (value: unknown) => {
  const list = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : null;

  if (!list) return value;

  return list
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0);
};

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

/** The listing states a landlord can set. */
export const PROPERTY_STATUS_VALUES = [
  "AVAILABLE",
  "RENTED",
  "UNAVAILABLE",
] as const;

export type PropertyStatus = (typeof PROPERTY_STATUS_VALUES)[number];

/** Labels and helper copy for the status picker. */
export const PROPERTY_STATUS_OPTIONS: {
  value: PropertyStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "AVAILABLE",
    label: "Available",
    description: "Visible to tenants and open to rental requests",
  },
  {
    value: "RENTED",
    label: "Rented",
    description: "Currently occupied — hidden from new requests",
  },
  {
    value: "UNAVAILABLE",
    label: "Unavailable",
    description: "Temporarily off the market",
  },
];

export const propertySchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(120, "Title must be at most 120 characters"),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must be at most 2000 characters"),

  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(80, "Location must be at most 80 characters"),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be at most 200 characters"),

  rentAmount: z.preprocess(
    toNumber,
    z
      .number({ error: "Enter a valid rent amount" })
      .positive("Rent must be greater than 0")
      .max(10_000_000, "Rent looks unrealistically high"),
  ),

  bedrooms: z.preprocess(
    toNumber,
    z
      .number({ error: "Enter a number of bedrooms" })
      .int("Bedrooms must be a whole number")
      .min(0, "Bedrooms cannot be negative")
      .max(50, "That is more bedrooms than we support"),
  ),

  bathrooms: z.preprocess(
    toNumber,
    z
      .number({ error: "Enter a number of bathrooms" })
      .int("Bathrooms must be a whole number")
      .min(0, "Bathrooms cannot be negative")
      .max(50, "That is more bathrooms than we support"),
  ),

  areaSquareFt: z.preprocess(
    toNumber,
    z
      .number({ error: "Enter a valid area in square feet" })
      .positive("Area must be greater than 0")
      .max(1_000_000, "Area looks unrealistically large"),
  ),

  amenities: z.preprocess(
    toStringArray,
    z
      .array(z.string().min(1).max(40, "Keep each amenity under 40 characters"))
      .min(1, "Add at least one amenity")
      .max(20, "You can add up to 20 amenities"),
  ),

  categoryId: z.preprocess(
    emptyToUndefined,
    z.uuid({ error: "Please select a category" }),
  ),

  image: z.preprocess(
    emptyToUndefined,
    z.url({ error: "Upload a photo of the property" }),
  ),

  status: z.preprocess(
    emptyToUndefined,
    z.enum(PROPERTY_STATUS_VALUES, { error: "Please select a status" }),
  ),
});

export type PropertyInput = z.infer<typeof propertySchema>;
export type PropertyField = keyof PropertyInput;

/* -------------------------------------------------------------------------- */
/*                               rental request                              */
/* -------------------------------------------------------------------------- */

/** Midnight today, in local time — the earliest a tenant can move in. */
function startOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export const rentalRequestSchema = z.object({
  moveInDate: z.preprocess(
    emptyToUndefined,
    z
      .string({ error: "Choose a move-in date" })
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        error: "Choose a valid date",
      })
      .refine(
        (value) => {
          const picked = new Date(value);
          picked.setHours(0, 0, 0, 0);
          return picked.getTime() >= startOfToday().getTime();
        },
        { error: "Move-in date can't be in the past" },
      ),
  ),

  durationMonths: z.preprocess(
    toNumber,
    z
      .number({ error: "Enter how many months" })
      .int("Use whole months")
      .min(1, "At least 1 month")
      .max(24, "Up to 24 months at a time"),
  ),
});

export type RentalRequestInput = z.infer<typeof rentalRequestSchema>;
export type RentalRequestField = keyof RentalRequestInput;

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
