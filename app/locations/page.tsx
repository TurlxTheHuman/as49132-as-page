import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Building2, Network, Globe } from "lucide-react";
import type { PeeringDBData, InternetExchange, Facility } from "@/lib/types";

async function getPeeringData(): Promise<PeeringDBData> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/peeringdb`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

function formatSpeed(speed: number): string {
  if (speed >= 100000) return `${speed / 1000}G`;
  if (speed >= 1000) return `${speed / 1000}G`;
  return `${speed}M`;
}

export default async function LocationsPage() {
  const data = await getPeeringData();
  const { internetExchanges, facilities } = data;

  // Group IXs by country
  const ixByCountry = internetExchanges.reduce(
    (acc: Record<string, InternetExchange[]>, ix: InternetExchange) => {
      const country = ix.ixCountry || "Unknown";
      if (!acc[country]) acc[country] = [];
      acc[country].push(ix);
      return acc;
    },
    {}
  );

  // Group facilities by country
  const facByCountry = facilities.reduce(
    (acc: Record<string, Facility[]>, fac: Facility) => {
      const country = fac.facCountry || "Unknown";
      if (!acc[country]) acc[country] = [];
      acc[country].push(fac);
      return acc;
    },
    {}
  );

  const countries = [
    ...new Set([...Object.keys(ixByCountry), ...Object.keys(facByCountry)]),
  ].sort();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Locations</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AS49132 is present at {internetExchanges.length} Internet Exchange
            points and {facilities.length} facilities worldwide.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Network className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground">
                {internetExchanges.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Internet Exchanges
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground">
                {facilities.length}
              </p>
              <p className="text-sm text-muted-foreground">Facilities</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground">
                {countries.length}
              </p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground">
                {[...new Set(internetExchanges.map((ix) => ix.ixCity))].length}
              </p>
              <p className="text-sm text-muted-foreground">Cities</p>
            </CardContent>
          </Card>
        </div>

        {/* Internet Exchanges Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Network className="h-6 w-6 text-primary" />
            Internet Exchanges
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-sm font-medium text-muted-foreground">
                    Exchange
                  </th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">
                    Location
                  </th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">
                    Speed
                  </th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">
                    IPv4
                  </th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">
                    IPv6
                  </th>
                </tr>
              </thead>
              <tbody>
                {internetExchanges.map((ix: InternetExchange, index: number) => (
                  <tr
                    key={`${ix.ix_id}-${index}`}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-4">
                      <span className="font-medium text-foreground">
                        {ix.ixName}
                      </span>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {ix.ixCity}, {ix.ixCountry}
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded">
                        {formatSpeed(ix.speed)}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-sm text-muted-foreground">
                      {ix.ipaddr4 || "-"}
                    </td>
                    <td className="py-4 font-mono text-sm text-muted-foreground">
                      {ix.ipaddr6 || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Facilities Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Facilities
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map((fac: Facility, index: number) => (
              <Card
                key={`${fac.fac_id}-${index}`}
                className="bg-card border-border hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {fac.facName}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {fac.facCity}, {fac.facCountry}
                    </span>
                  </div>
                  {fac.facAddress && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {fac.facAddress}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>
            Data sourced from{" "}
            <a
              href="https://www.peeringdb.com/asn/49132"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              PeeringDB
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
