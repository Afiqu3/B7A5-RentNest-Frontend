export type LoginState = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export type FieldErrors<TFields extends string> = Partial<
  Record<TFields, string[]>
>;

export type AuthFormState<TFields extends string> =
  | false
  | {
      success: boolean;
      message?: string;
      statusCode?: number;
      errors?: FieldErrors<TFields>;
      data?: unknown;
    };

export type LoginFormState = AuthFormState<"email" | "password">;

export type RegisterFormState = AuthFormState<
  "name" | "email" | "phone" | "password" | "role"
>;

export type RegistrationState = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: Role;
  };
};

export type IUser = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    activeStatus: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type NavbarProps = {
  user: IUser;
};

export type LinkItem = { label: string; href: string; icon: React.ElementType };

export type Role = "TENANT" | "LANDLORD";

/** Every role the platform recognises, including the admin role. */
export type UserRole = Role | "ADMIN";

/** The shape of `IUser["data"]`, narrowed so `role` is a known union. */
export type UserProfile = Omit<IUser["data"], "role"> & { role: UserRole };

/** A single entry in the dashboard sidebar. */
export type SidebarNavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  /** Only highlight when the pathname matches exactly (used for index routes). */
  exact?: boolean;
  /** Optional count rendered as a badge on the right of the item. */
  badge?: number;
};

/** A labelled section of sidebar entries. */
export type SidebarNavGroup = {
  label: string;
  items: SidebarNavItem[];
};

export type ProfileFormState =
  | false
  | {
      success: boolean;
      message?: string;
      errors?: FieldErrors<"name" | "phone">;
      data?: unknown;
    };

/* -------------------------------------------------------------------------- */
/*                                 properties                                 */
/* -------------------------------------------------------------------------- */

/** Pagination envelope returned alongside every list endpoint. */
export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiListResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  meta: ApiMeta;
};

export type PropertyCategory = {
  id: string;
  name: string;
};

export type PropertyLandlord = {
  name: string;
  phone: string;
  email: string;
};

/**
 * A property as returned by `GET /api/properties/available`.
 *
 * Fields the backend contract doesn't guarantee are optional so a missing
 * column degrades to a fallback in the UI rather than crashing the page.
 */
export type Property = {
  id: string;
  title: string;
  description: string;
  location: string;
  rentAmount: number;
  amenities: string[];
  status: string;
  createdAt: string;
  updatedAt?: string;
  address?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSquareFt?: number | null;
  images?: string[] | null;
  image?: string | null;
  categoryId?: string | null;
  category?: PropertyCategory | null;
  landlord?: PropertyLandlord | null;
};

export type PropertySortBy = "createdAt" | "rentAmount";
export type PropertySortOrder = "asc" | "desc";

/** Normalised, fully-resolved query the properties list is rendered from. */
export type PropertyQuery = {
  searchTerm: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  sortBy: PropertySortBy;
  sortOrder: PropertySortOrder;
  page: number;
  limit: number;
};

/** Raw `searchParams` as Next.js hands them to a page. */
export type RawSearchParams = Record<string, string | string[] | undefined>;
