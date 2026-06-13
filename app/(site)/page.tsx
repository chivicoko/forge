import type { Metadata } from "next"
import { Hero }           from "@/components/home/Hero"
import { BrandBanner }    from "@/components/home/BrandBanner"
import { CategoriesStrip } from "@/components/home/CategoriesStrip"
import { FeaturedSection } from "@/components/home/FeaturedSection"
import { NewArrivals }    from "@/components/home/NewArrivals"
import { AboutSection }   from "@/components/home/AboutSection"
import { StatsSection }   from "@/components/home/StatsSection"
import { SocialProof }    from "@/components/home/SocialProof"
import { Newsletter }     from "@/components/home/Newsletter"

export const metadata: Metadata = {
  title: "FORGE — Premium Men's Bodywear",
  description:
    "Discover FORGE's premium men's bodywear collection. Quality craftsmanship, intentional design — for men who mean it.",
  alternates: { canonical: "https://forge-wears.com" },
}

export default function HomePage() {
  return (
    <div className="page-enter">
      <Hero />
      <BrandBanner />
      <CategoriesStrip />
      <FeaturedSection />
      <NewArrivals />
      <AboutSection />
      <StatsSection />
      <SocialProof />
      <Newsletter />
    </div>
  )
}
