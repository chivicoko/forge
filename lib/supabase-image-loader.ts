export default function supabaseImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // For Supabase storage URLs, append transform params directly
  // Supabase Storage supports image transformations via query params
  const url = new URL(src);
  url.searchParams.set("width", width.toString());
  url.searchParams.set("quality", (quality ?? 80).toString());
  url.searchParams.set("resize", "contain");
  return url.toString();
}
