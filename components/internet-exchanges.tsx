"use client";

import { InternetExchange } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, Wifi } from "lucide-react";

interface InternetExchangesProps {
  exchanges: InternetExchange[];
}

function formatSpeed(speed: number): string {
  if (speed >= 1000) return `${speed / 1000} Gbps`;
  return `${speed} Mbps`;
}

export function InternetExchanges({ exchanges }: InternetExchangesProps) {
  if (exchanges.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wifi className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Internet Exchanges</h2>
          <Badge variant="secondary">{exchanges.length}</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exchanges.map((ix, index) => (
            <div
              key={`${ix.ix_id}-${ix.ipaddr4}-${ix.ipaddr6}-${index}`}
              className="group relative p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Exchange Name */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {ix.ixName}
                </h3>
                {ix.is_rs_peer && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    RS
                  </Badge>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>{ix.ixCity}, {ix.ixCountry}</span>
              </div>

              {/* Speed */}
              <div className="flex items-center gap-1.5 text-sm mb-4">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground">{formatSpeed(ix.speed)}</span>
              </div>

              {/* IP Addresses */}
              <div className="space-y-2">
                {ix.ipaddr4 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-8">IPv4</span>
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                      {ix.ipaddr4}
                    </code>
                  </div>
                )}
                {ix.ipaddr6 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-8">IPv6</span>
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground truncate max-w-[200px]">
                      {ix.ipaddr6}
                    </code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
