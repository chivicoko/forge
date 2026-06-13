"use client";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Emeka O.",
    stars: 5,
    text: "Quality is unmatched. The fabric on the performance shorts is genuinely impressive — I've worn these through Lagos heat and they hold up perfectly.",
    role: "Lagos, Nigeria",
  },
  {
    name: "James T.",
    stars: 5,
    text: "Finally a brand that understands fit. Not too slim, not boxy. The polo I got looks tailored. Will 100% be ordering again.",
    role: "London, UK",
  },
  {
    name: "Chukwudi A.",
    stars: 5,
    text: "Shipped fast and packaged beautifully. The boxer briefs are the most comfortable I've owned. Worth every naira.",
    role: "Abuja, Nigeria",
  },
  {
    name: "Tunde B.",
    stars: 5,
    text: "FORGE is my go-to for gifting. Bought a set for my brother — he called me within an hour just to say thank you. The presentation alone is 10/10.",
    role: "Toronto, Canada",
  },
];

export function SocialProof() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Customer Reviews
          </p>
          <h2 className="text-3xl md:text-4xl font-black uppercase">
            What they&apos;re saying
          </h2>
          <div className="flex items-center justify-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 text-sm font-semibold text-muted-foreground">
              4.9 / 5 from 200+ reviews
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map(({ name, stars, text, role }) => (
            <div
              key={name}
              className="bg-background border rounded-2xl p-5 hover:border-amber-500/40 hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground flex-1 mb-5">
                &quot;{text}&quot;
              </p>
              <div>
                <p className="font-bold text-sm">{name}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
