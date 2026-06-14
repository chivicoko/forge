import Link from "next/link";
import { Instagram, Twitter, Facebook, Mail, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-black text-2xl mb-4"
            >
              <span className="text-amber-500">⬡</span> FORGE
            </Link>
            <p className="text-sm opacity-70 max-w-xs leading-relaxed mb-6">
              Premium men&apos;s bodywear crafted with intention. We design with
              purpose — drawing from classic forms and modern refinement to
              create pieces that last.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: "#instagram", label: "Instagram" },
                { icon: Twitter, href: "#twitter", label: "Twitter" },
                { icon: Facebook, href: "#facebook", label: "Facebook" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="p-2 rounded-full border border-white/20 hover:border-amber-500 hover:text-amber-500 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-amber-500">
              Shop
            </h3>
            <ul className="space-y-2 text-sm opacity-70">
              {[
                ["Store", "/store"],
                ["Featured", "/featured"],
                ["New Arrivals", "/store?sort=new"],
                ["Sale", "/store?sort=sale"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="hover:text-amber-500 hover:opacity-100 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-amber-500">
              Support
            </h3>
            <ul className="space-y-2 text-sm opacity-70">
              {[
                ["Order Tracking", "/order-tracking"],
                ["Returns", "#"],
                ["Sizing Guide", "#"],
                ["Contact Us", "#"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="hover:text-amber-500 hover:opacity-100 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-60">
          <p>© 2025 FORGE. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs">
            <Mail className="h-3 w-3" />
            <span>wearsbyforge@gmail.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
