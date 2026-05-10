"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!accessToken) return null;

  return {
    "Content-Type": "application/json",
    Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
  };
};

export async function createOrder(payload: {
  fullName: string;
  phone: string;
  address: string;
  district: string;
  notes?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    if (!headers)
      return { success: false, message: "Unauthorized", code: "UNAUTHORIZED" };

    const res = await fetch(`${BASE_API_URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (res.ok) {
      revalidateTag("cart", "max");
      revalidateTag("orders", "max");
    }
    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function getMyOrders() {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_API_URL}/orders/my-orders`, {
      method: "GET",
      headers,
      next: { tags: ["orders"] },
    });

    return res.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, message: "Something went wrong" };
  }
}
