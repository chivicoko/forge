import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side client (uses anon key, respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client (uses service role key, bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// ─── Product helpers ───────────────────────────────────────────
export async function getProducts(categoryId?: string) {
  let q = supabaseAdmin.from("products").select("*").eq("is_listed", true);
  if (categoryId) q = q.eq("category_id", categoryId);
  const { data, error } = await q.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getProductById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// ─── Category helpers ──────────────────────────────────────────
export async function getCategories() {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("is_listed", true);
  if (error) throw error;
  return data;
}

// ─── Order helpers ─────────────────────────────────────────────
export async function getOrdersByUserId(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllOrders() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createOrder(payload: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Rates helpers ─────────────────────────────────────────────
export async function getRates() {
  const { data, error } = await supabaseAdmin.from("rates").select("*");
  if (error) throw error;
  return data;
}

// ─── Storage helpers ───────────────────────────────────────────
export async function uploadProductImage(file: File, path: string) {
  const { data, error } = await supabaseAdmin.storage
    .from("product-images")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("product-images").getPublicUrl(data.path);
  return publicUrl;
}
