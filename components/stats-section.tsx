"use client";

import { Network, RipeData } from "@/lib/types";
import { Globe, Server, Wifi, Route, ArrowUp, ArrowDown } from "lucide-react";

interface StatsSectionProps {
  network: Network;
  ixCount: number;
  facilityCount: number;
  ripeData?: RipeData;
}

export function StatsSection({ network, ixCount, facilityCount, ripeData }: StatsSectionProps) {
  const stats = [
    {
      label: "Global Peers",
      value: ripeData?.peers.total || 0,
      icon: Globe,
      description: "Observed BGP neighbours",
    },
    {
      label: "Upstream Peers",
      value: ripeData?.peers.upstream || 0,
      icon: ArrowUp,
      description: "Transit providers",
    },
    {
      label: "Downstream Peers",
      value: ripeData?.peers.downstream || 0,
      icon: ArrowDown,
      description: "Customers",
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
      value: ripeData?.prefixes.ipv4.count || network.info_prefixes4 || 0,
      icon: Route,
      description: "Announced routes",
    },
  ];

  return (
    <section className="py-16 border-y border-border bg-card/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
