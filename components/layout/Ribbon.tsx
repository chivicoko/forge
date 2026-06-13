"use client";
import Marquee from "react-fast-marquee";

export function Ribbon() {
  return (
    <div className="bg-amber-500 dark:bg-amber-600 py-1.5 overflow-hidden border-b border-amber-600 dark:border-amber-700">
      <Marquee
        gradient={false}
        speed={50}
        pauseOnHover
        className="text-white text-xs font-medium tracking-widest uppercase"
      >
        &nbsp;• FORGE &nbsp;• PREMIUM MEN&apos;S BODYWEAR &nbsp;• NEW ARRIVALS
        &nbsp;• FREE SHIPPING OVER $150 &nbsp;• FORGE &nbsp;• PREMIUM MEN&apos;S
        BODYWEAR &nbsp;• NEW ARRIVALS &nbsp;• FREE SHIPPING OVER $150&nbsp;
      </Marquee>
    </div>
  );
}
