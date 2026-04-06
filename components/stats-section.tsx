"use client";

import { Network } from "@/lib/types";
import { Globe, Server, Wifi, Route } from "lucide-react";

interface StatsSectionProps {
  network: Network;
  ixCount: number;
  facilityCount: number;
}

export function StatsSection({ network, ixCount, facilityCount }: StatsSectionProps) {
  const stats = [
    {
      label: "Global Peers",
      value: ixCount,
      icon: Globe,
      description: "Active peering sessions",
    },
    {
      label: "Internet Exchanges",
      value: ixCount,
      icon: Wifi,
      description: "Connected IXPs",
    },
    {
      label: "Locations",
      value: facilityCount,
      icon: Server,
      description: "Data center presence",
    },
    {
      label: "IPv4 Prefixes",
      value: network.info_prefixes4 || 0,
      icon: Route,
      description: "Announced routes",
    },
  ];

  return (
    <section className="py-16 border-y border-border bg-card/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-foreground">
                {stat.value.toLocaleString()}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
