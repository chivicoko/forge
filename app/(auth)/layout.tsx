import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid place-items-center bg-stone-50 dark:bg-neutral-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-black text-2xl"
          >
            <span className="text-amber-500">⬡</span> FORGE
          </Link>
          <p className="text-muted-foreground text-sm mt-2">
            Premium Men&apos;s Bodywear
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
