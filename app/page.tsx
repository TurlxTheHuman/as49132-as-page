"use client";

import useSWR from "swr";
import { PeeringDBData, RipeData } from "@/lib/types";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { InternetExchanges } from "@/components/internet-exchanges";
import { Facilities } from "@/components/facilities";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error, isLoading } = useSWR<PeeringDBData>(
    "/api/peeringdb",
    fetcher
  );
  
  const { data: ripeData, isLoading: ripeLoading } = useSWR<RipeData>(
    "/api/ripe",
    fetcher
  );

  if (isLoading || ripeLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Loading network data...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !data.network) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="p-4 rounded-full bg-destructive/10">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            Failed to load network data
          </h1>
          <p className="text-muted-foreground max-w-md">
            Unable to fetch information from PeeringDB. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection 
        network={data.network} 
        peerCount={ripeData?.peers.total || 0} 
      />
      
      <StatsSection 
        network={data.network}
        ixCount={data.internetExchanges.length}
        facilityCount={data.facilities.length}
        ripeData={ripeData}
      />

      <InternetExchanges exchanges={data.internetExchanges} />
      
      <Facilities facilities={data.facilities} />

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Data sourced from{" "}
            <a
              href={`https://www.peeringdb.com/asn/${data.network.asn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              PeeringDB
            </a>
            {" & "}
            <a
              href={`https://stat.ripe.net/AS${data.network.asn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              RIPEstat
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
