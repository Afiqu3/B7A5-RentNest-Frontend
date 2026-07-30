export type LoginState = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export type Role = "TENANT" | "LANDLORD";

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
