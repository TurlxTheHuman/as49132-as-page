"use client";

import { Facility } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Server, MapPin } from "lucide-react";

interface FacilitiesProps {
  facilities: Facility[];
}

export function Facilities({ facilities }: FacilitiesProps) {
  if (facilities.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-card/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary/10">
            <Server className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Locations</h2>
          <Badge variant="secondary">{facilities.length}</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                {facility.facName}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{facility.facCity}, {facility.facCountry}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
