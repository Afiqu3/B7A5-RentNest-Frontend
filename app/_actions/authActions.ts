"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { LoginFormState, RegisterFormState } from "@/lib/types";
import { loginSchema, registerSchema } from "@/lib/validations";

export const loginAction = async (
  redirectTo: string,
  prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> => {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  const payload = {
    email,
    password,
  };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (result.success) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload;

    if (
      redirectTo &&
      typeof redirectTo === "string" &&
      redirectTo.startsWith("/") &&
      !redirectTo.startsWith("//")
    ) {
      redirect(redirectTo);
    }

    if (decodedToken.role === "TENANT") {
      redirect("/dashboard");
    } else if (decodedToken.role === "LANDLORD") {
      redirect("/landlord-dashboard");
    } else if (decodedToken.role === "ADMIN") {
      redirect("/admin-dashboard");
    }
  }
  return result;
};

export const registrationAction = async (
  prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> => {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const payload = parsed.data;

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = await res.json();

  return result;
};
