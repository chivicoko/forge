"use client";
import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductByIdQueryOptions,
  listCategoriesQueryOptions,
  updateProduct,
  uploadImage,
} from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Loader2, Upload, X, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "WHITE",
  "BLACK",
  "NAVY BLUE",
  "BEIGE",
  "GREY",
  "OLIVE GREEN",
  "BURGUNDY",
  "BROWN",
  "CREAM",
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const schema = z.object({
  name: z.string().min(1, "Name required"),
  description: z.string().min(1, "Description required"),
  category_id: z.string().uuid("Select a category"),
  price: z.coerce.number().positive("Must be positive"),
  stock: z.coerce.number().int().min(0, "Must be 0 or more"),
  weight: z.coerce.number().min(0).optional(),
  is_listed: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const qc = useQueryClient();
  const router = useRouter();

  const { data: product, isLoading } = useQuery(getProductByIdQueryOptions(id));
  const { data: categories } = useQuery(listCategoriesQueryOptions);

  // Derive arrays directly from product — no state, no effect needed
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Track whether we've seeded local state from product
  const seeded = useState(() => false);
  const isSeeded = seeded[0];
  const setSeeded = seeded[1];

  // Seed once when product arrives — using useState lazy init pattern
  if (product && !isSeeded) {
    setSeeded(true);
    setColors(product.colors ?? []);
    setSizes(product.sizes ?? []);
    setExtraImages(product.images ?? []);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    // defaultValues reads product synchronously when the form mounts after data loads
    values: product
      ? {
          name: product.name,
          description: product.description,
          category_id: product.category_id,
          price: product.price,
          stock: product.stock,
          weight: product.weight ?? undefined,
          is_listed: product.is_listed,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (body: unknown) => updateProduct(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated!");
      router.push("/dashboard/inventory");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (extraImages.length + files.length > 4) {
      toast.warning("Max 4 images");
      return;
    }
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setExtraImages((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter((i) => i !== val) : [...arr, val]);

  const onSubmit = (values: FormData) =>
    mutation.mutate({ ...values, images: extraImages, colors, sizes });

  if (isLoading)
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/inventory">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black">Edit Product</h1>
          <p className="text-sm text-muted-foreground truncate max-w-xs">
            {product?.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Images */}
        <div className="bg-background border rounded-2xl p-5">
          <h2 className="font-bold mb-4">
            Images{" "}
            <span className="text-muted-foreground font-normal text-sm">
              (max 4)
            </span>
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {extraImages.map((url, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden border bg-muted"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="150px"
                />
                <button
                  type="button"
                  onClick={() =>
                    setExtraImages(extraImages.filter((_, j) => j !== i))
                  }
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {extraImages.length < 4 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-amber-500 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-amber-500 transition-colors"
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span className="text-xs">Add</span>
                  </>
                )}
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Details */}
        <div className="bg-background border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Details</h2>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("is_listed")}
                className="accent-amber-500 w-4 h-4 rounded"
              />
              <span className="font-semibold">Listed</span>
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                Name *
              </label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                Description *
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              {errors.description && (
                <p className="text-xs text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                Category *
              </label>
              <select
                {...register("category_id")}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-xs text-destructive mt-1">
                  {errors.category_id.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                Price (₦) *
              </label>
              <Input {...register("price")} type="number" />
              {errors.price && (
                <p className="text-xs text-destructive mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                Stock *
              </label>
              <Input {...register("stock")} type="number" />
              {errors.stock && (
                <p className="text-xs text-destructive mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                Weight (kg)
              </label>
              <Input {...register("weight")} type="number" step="0.1" />
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-background border rounded-2xl p-5">
          <h2 className="font-bold mb-3">Sizes</h2>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => toggle(sizes, setSizes, s)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all ${sizes.includes(s) ? "bg-amber-500 text-white border-amber-500" : "hover:border-amber-500 hover:text-amber-500"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="bg-background border rounded-2xl p-5">
          <h2 className="font-bold mb-3">Colors</h2>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => toggle(colors, setColors, c)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${colors.includes(c) ? "bg-amber-500 text-white border-amber-500" : "hover:border-amber-500 hover:text-amber-500"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2 rounded-xl"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
