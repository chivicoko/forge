"use client";
export const dynamic = "force-dynamic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listCategoriesQueryOptions, addProduct, uploadImage } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Loader2, Upload, X, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
});
type FormData = z.infer<typeof schema>;

export default function AddProductPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const { data: categories } = useQuery(listCategoriesQueryOptions);
  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added!");
      router.push("/dashboard/inventory");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > 4) {
      toast.warning("Max 4 images");
      return;
    }

    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      console.log("UPLOAD RESULTS:", urls);
      setImages((prev) => [...prev, ...urls]);
      toast.success(
        `${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`,
      );
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const toggleItem = (
    arr: string[],
    set: (v: string[]) => void,
    item: string,
  ) => set(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);

  const onSubmit = (values: FormData) => {
    if (images.length === 0) {
      toast.warning("Add at least one image");
      return;
    }
    mutation.mutate({
      ...values,
      images,
      colors,
      sizes,
      is_listed: true,
    });
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/inventory">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black">Add Product</h1>
          <p className="text-sm text-muted-foreground">
            Fill in all product details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Images */}
        <div className="bg-background border rounded-2xl p-5">
          <h2 className="font-bold mb-4">
            Product Images{" "}
            <span className="text-muted-foreground font-normal text-sm">
              (max 4)
            </span>
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {images.map((url, i) => (
              <div
                key={url}
                className="relative aspect-square rounded-xl overflow-hidden border bg-muted"
              >
                <Image
                  src={url}
                  alt={`Image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {images.length < 4 && (
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
                    <span className="text-xs">Upload</span>
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
          <h2 className="font-bold">Product Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                Product Name *
              </label>
              <Input {...register("name")} placeholder="The Crest Shirt" />
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
                placeholder="Tailored cotton shirt with minimal detailing…"
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
              <Input {...register("price")} type="number" placeholder="15000" />
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
              <Input {...register("stock")} type="number" placeholder="50" />
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
              <Input
                {...register("weight")}
                type="number"
                step="0.1"
                placeholder="0.5"
              />
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-background border rounded-2xl p-5">
          <h2 className="font-bold mb-3">Available Sizes</h2>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => toggleItem(sizes, setSizes, s)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all ${sizes.includes(s) ? "bg-amber-500 text-white border-amber-500" : "hover:border-amber-500 hover:text-amber-500"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="bg-background border rounded-2xl p-5">
          <h2 className="font-bold mb-3">Available Colors</h2>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => toggleItem(colors, setColors, c)}
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
          className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Product
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
