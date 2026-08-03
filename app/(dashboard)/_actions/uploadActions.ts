"use server";

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  type ImageUploadState,
} from "@/lib/listings";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// A "use server" module may only export async functions — the size/type
// constants and the result type live in `@/lib/listings`.

function failure(message: string): ImageUploadState {
  return { success: false, message, url: null };
}

/**
 * Uploads a single property photo to Cloudinary and returns its secure URL.
 *
 * The upload runs server-side so the API secret never reaches the browser.
 * Only the resulting URL is stored on the property record — the backend never
 * sees the binary.
 */
export async function uploadPropertyImage(
  formData: FormData,
): Promise<ImageUploadState> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return failure("Choose an image to upload.");
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return failure("Only JPG, PNG, WebP or AVIF images are supported.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return failure("That image is larger than 5MB. Try a smaller one.");
  }

  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("[upload] Cloudinary credentials are not configured.");
    return failure("Image uploads are not configured on this server.");
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "rentnest/properties",
          resource_type: "image",
          // Cap the stored asset so a 5MB phone photo doesn't become a 5MB
          // request on every card render.
          transformation: [
            { width: 1600, height: 1200, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary returned no result."));
            return;
          }
          resolve(result);
        },
      );

      stream.end(buffer);
    });

    return {
      success: true,
      message: "Photo uploaded.",
      url: uploaded.secure_url,
    };
  } catch (error) {
    console.error("[upload] Cloudinary upload failed:", error);
    return failure("We couldn't upload that photo. Please try again.");
  }
}
