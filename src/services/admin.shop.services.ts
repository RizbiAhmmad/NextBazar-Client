"use server";

import { cookies } from "next/headers";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  return { accessToken, sessionToken };
}

export async function getAllShops(params: Record<string, string> = {}) {
  try {
    const { accessToken, sessionToken } = await getAuthHeaders();
    if (!accessToken) return { success: false, data: [], meta: null };

    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_API_URL}/shops${query ? `?${query}` : ""}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok) return { success: false, data: [], meta: null };
    return { success: true, data: result.data, meta: result.meta };
  } catch {
    return { success: false, data: [], meta: null };
  }
}

export async function changeShopStatus(
  shopId: string,
  status: "ACTIVE" | "BLOCKED" | "PENDING",
) {
  try {
    const { accessToken, sessionToken } = await getAuthHeaders();
    if (!accessToken) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_API_URL}/shops/${shopId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
      body: JSON.stringify({ status }),
    });

    const result = await res.json();
    if (!res.ok) return { success: false, message: result.message || "Failed" };
    return { success: true, data: result.data, message: result.message };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}
