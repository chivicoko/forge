import { queryOptions } from "@tanstack/react-query";
import type { ProductType, CategoryType, RatesType, OrderType } from "@/types";

const BASE = "/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Products ──────────────────────────────────────────────────
export const listProductsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: () => apiFetch<ProductType[]>("/products"),
  staleTime: 30_000,
});

export const listProductsByCategoryQueryOptions = (categoryId: string) =>
  queryOptions({
    queryKey: ["products", "category", categoryId],
    queryFn: () => apiFetch<ProductType[]>(`/products?category=${categoryId}`),
    enabled: !!categoryId,
  });

export const getProductByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["products", id],
    queryFn: () => apiFetch<ProductType>(`/products/${id}`),
    enabled: !!id,
  });

export const addProduct = (body: unknown) =>
  apiFetch<ProductType>("/products", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateProduct = (id: string, body: unknown) =>
  apiFetch<ProductType>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteProduct = (id: string) =>
  apiFetch<{ success: boolean }>(`/products/${id}`, { method: "DELETE" });

// ─── Categories ────────────────────────────────────────────────
export const listCategoriesQueryOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: () => apiFetch<CategoryType[]>("/categories"),
});

export const addCategory = (body: unknown) =>
  apiFetch<CategoryType>("/categories", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const deleteCategory = (id: string) =>
  apiFetch<{ success: boolean }>(`/categories/${id}`, { method: "DELETE" });

// ─── Rates ─────────────────────────────────────────────────────
export const listRatesQueryOptions = queryOptions({
  queryKey: ["rates"],
  queryFn: () => apiFetch<RatesType[]>("/rates"),
  staleTime: 60_000,
});

export const getRateByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["rates", id],
    queryFn: () => apiFetch<RatesType>(`/rates/${id}`),
    enabled: !!id,
    staleTime: 60_000,
  });

export const addRate = (body: unknown) =>
  apiFetch<RatesType>("/rates", { method: "POST", body: JSON.stringify(body) });

export const deleteRate = (id: string) =>
  apiFetch<{ success: boolean }>(`/rates/${id}`, { method: "DELETE" });

// ─── Orders ────────────────────────────────────────────────────
export const listUserOrdersQueryOptions = queryOptions({
  queryKey: ["orders", "user"],
  queryFn: () => apiFetch<OrderType[]>("/orders"),
});

export const listAllOrdersQueryOptions = queryOptions({
  queryKey: ["orders", "all"],
  queryFn: () => apiFetch<OrderType[]>("/orders/all"),
});

export const makeOrder = (body: unknown) =>
  apiFetch<{ url: string; orderId: string }>("/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });

// ─── Upload ────────────────────────────────────────────────────
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");
  const { url } = await res.json();
  return url;
}
