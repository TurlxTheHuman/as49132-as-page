"use client";

import { Network } from "@/lib/types";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  network: Network;
  peerCount: number;
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}</span>;
}

export function HeroSection({ network, peerCount }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
        <div className="text-center">
          {/* AS Number */}
          <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground">
            AS49132
          </h1>

          {/* Tagline */}
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            {network.name}
          </p>

          {/* Quick Links */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={`https://www.peeringdb.com/asn/${network.asn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              View on PeeringDB
            </a>

            {network.website && (
              <a
                href={network.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
