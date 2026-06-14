import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://forge-wears.com"),
  title: { default: "FORGE — Premium Men's Bodywear", template: "%s | FORGE" },
  description:
    "Premium men's bodywear crafted with intention. Built on quality, made to last, designed to move with you.",
  keywords: [
    "men's fashion",
    "bodywear",
    "premium clothing",
    "men's wear",
    "luxury fashion",
    "Nigerian fashion",
  ],
  authors: [{ name: "FORGE", url: "https://forge-wears.com" }],
  creator: "FORGE",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://forge-wears.com",
    title: "FORGE — Premium Men's Bodywear",
    description: "Premium men's bodywear crafted with intention.",
    siteName: "FORGE",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "FORGE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FORGE — Premium Men's Bodywear",
    description: "Premium men's bodywear crafted with intention.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
    apple: [{ url: "/icons/icon-192.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F59E0B" },
    { media: "(prefers-color-scheme: dark)", color: "#D97706" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <Providers>
          {children}
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}
