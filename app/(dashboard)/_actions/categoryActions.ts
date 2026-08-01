"use server";

import { revalidateTag } from "next/cache";

import { isAccessTokenExist } from "@/service/refreshToken";
import { categorySchema } from "@/lib/validations";

export type CategoryItem = {
  id: string;
  name: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CategoryActionState =
  | {
      success: true;
      message: string;
      category: CategoryItem | null;
      mode: "create" | "update";
    }
  | {
      success: false;
      message: string;
      category: null;
      mode: null;
    };

function normalizeCategory(
  payload: unknown,
  fallbackName: string,
  fallbackId?: string,
): CategoryItem | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const id = typeof record.id === "string" ? record.id : (fallbackId ?? "");
  const name = typeof record.name === "string" ? record.name : fallbackName;
  const deletedAt =
    typeof record.deletedAt === "string" || record.deletedAt === null
      ? record.deletedAt
      : null;
  const createdAt =
    typeof record.createdAt === "string"
      ? record.createdAt
      : new Date().toISOString();
  const updatedAt =
    typeof record.updatedAt === "string" ? record.updatedAt : createdAt;

  if (!id && !name) {
    return null;
  }

  return {
    id: id || fallbackId || `temp-${Date.now()}`,
    name,
    deletedAt,
    createdAt,
    updatedAt,
  };
}

export const getAllCategory = async () => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },

    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 24, // 1day
      tags: ["category"],
    },
  });

  const result = await res.json();

  return result;
};

export const submitCategoryAction = async (
  _prevState: CategoryActionState,
  formData: FormData,
) => {
  const rawName = String(formData.get("name") ?? "").trim();
  const editingId = String(formData.get("editingId") ?? "").trim();

  const parsed = categorySchema.safeParse({ name: rawName });
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid category name",
      category: null,
      mode: null,
    } satisfies CategoryActionState;
  }

  try {
    const result = editingId
      ? await updateCategory(editingId, parsed.data.name)
      : await createCategory(parsed.data.name);

    if (result?.success) {
      const normalizedCategory = normalizeCategory(
        result?.data,
        parsed.data.name,
        editingId || undefined,
      );

      return {
        success: true,
        message: editingId
          ? "Category updated successfully."
          : "Category created successfully.",
        category: normalizedCategory,
        mode: editingId ? "update" : "create",
      } satisfies CategoryActionState;
    }

    return {
      success: false,
      message: result?.message || "Something went wrong.",
      category: null,
      mode: null,
    } satisfies CategoryActionState;
  } catch {
    return {
      success: false,
      message: "Unable to save this category right now.",
      category: null,
      mode: null,
    } satisfies CategoryActionState;
  }
};

export const createCategory = async (categoryName: string) => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    body: JSON.stringify({ name: categoryName }),
  });

  const result = await res.json();
  revalidateTag("category", {
    expire: 0,
  });

  return result;
};

export const updateCategory = async (
  categoryId: string,
  categoryName: string,
) => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/categories/${categoryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({ name: categoryName }),
    },
  );
  const result = await res.json();
  revalidateTag("category", {
    expire: 0,
  });

  return result;
};

export const deleteCategory = async (categoryId: string) => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/categories/${categoryId}`,
    {
      method: "DELETE",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    },
  );
  const result = await res.json();
  revalidateTag("category", {
    expire: 0,
  });

  return result;
};
