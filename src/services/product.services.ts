"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export async function createProduct(payload: FormData) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Unauthorized" };
    }

    const res = await fetch(`${BASE_API_URL}/products`, {
      method: "POST",
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
      body: payload,
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to create product",
      };
    }

    revalidateTag("products");

    return { success: true, data: result.data, message: result.message };
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    return { success: false, message: "Something went wrong" };
  }
}
