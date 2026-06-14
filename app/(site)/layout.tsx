export const dynamic = "force-dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { Ribbon } from "@/components/layout/Ribbon";
import { CookieConsent } from "@/components/home/CookieConsent";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Accessibility — skip nav */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-999 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-amber-500 focus:text-white focus:font-bold"
      >
        Skip to content
      </a>

      <Ribbon />
      <Navbar />
      <main id="main-content" className="pt-">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
