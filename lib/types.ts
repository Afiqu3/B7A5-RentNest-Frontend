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

// user: {
//   success: true,
//   statusCode: 200,
//   message: 'User profile fetched successfully',
//   data: {
//     id: '7fa4c6e5-aaf1-4b21-b2a8-6f2554f81466',
//     name: 'admin1',
//     email: 'a1@mail.com',
//     phone: '12345',
//     activeStatus: 'ACTIVE',
//     role: 'LANDLORD',
//     createdAt: '2026-07-07T06:25:34.195Z',
//     updatedAt: '2026-07-07T06:25:34.195Z'
//   }
// }

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
