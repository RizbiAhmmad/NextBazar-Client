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
  items?: { productId: string; quantity: number }[];
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

export async function getAllOrders(params?: Record<string, string>) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return { success: false, message: "Unauthorized" };

    const query = new URLSearchParams(params).toString();
    const res = await fetch(
      `${BASE_API_URL}/orders${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers,
        next: { tags: ["orders"] },
        cache: "no-store",
      },
    );

    return res.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function getOrderById(id: string) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_API_URL}/orders/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    return res.json();
  } catch (error) {
    console.error("Error fetching order details:", error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_API_URL}/orders/${id}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });

    const result = await res.json();
    if (res.ok) revalidateTag("orders", "max");
    return result;
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function deleteOrder(id: string) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_API_URL}/orders/${id}`, {
      method: "DELETE",
      headers,
    });

    const result = await res.json();
    if (res.ok) revalidateTag("orders", "max");
    return result;
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function getVendorOrders(
  orderType?: "ONLINE" | "POS" | "LANDING_PAGE",
) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return { success: false, message: "Unauthorized" };

    const query = orderType ? `?orderType=${orderType}` : "";
    const res = await fetch(`${BASE_API_URL}/orders/vendor-orders${query}`, {
      method: "GET",
      headers,
      next: { tags: ["orders"] },
    });

    return res.json();
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function updateOrderItemStatus(itemId: string, status: string) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_API_URL}/orders/items/${itemId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });

    const result = await res.json();
    if (res.ok) revalidateTag("orders", "max");
    return result;
  } catch (error) {
    console.error("Error updating order item status:", error);
    return { success: false, message: "Something went wrong" };
  }
}
