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
