import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Info, FileText } from "lucide-react";
export const dynamic = 'force-dynamic';

async function getPeeringData() {
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

export default async function PeeringPolicyPage() {
  const data = await getPeeringData();
  const { network } = data;

  const policyDetails = [
    {
      label: "General Policy",
      value: network.policy_general || "Open",
      icon: FileText,
    },
    {
      label: "Traffic Ratio",
      value: network.info_ratio || "Balanced",
      icon: Info,
    },
    {
      label: "Traffic Volume",
      value: network.info_traffic || "Not Disclosed",
      icon: Info,
    },
    {
      label: "Network Scope",
      value: network.info_scope || "Regional",
      icon: Info,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Peering Policy
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AS49132 maintains an open peering policy. We welcome peering
            requests from networks of all sizes.
          </p>
        </div>

        {/* Policy Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {policyDetails.map((item) => (
            <Card key={item.label} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground capitalize">
                  {item.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Requirements */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                  Valid ASN registered in PeeringDB
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                  Publicly routable IP space
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                  Up-to-date IRR records
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                  24/7 NOC contact available
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                  Willingness to peer at mutual exchange points
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <XCircle className="h-5 w-5 text-red-500" />
                We Do Not Accept
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 shrink-0" />
                  Pointing default routes at our network
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 shrink-0" />
                  Hijacked or unregistered prefixes
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 shrink-0" />
                  Networks without abuse handling procedures
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 shrink-0" />
                  BGP hijacking or route leaks
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Technical Info */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              Technical Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">AS Number</p>
                <p className="text-lg font-mono font-semibold text-foreground">
                  AS{network.asn}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">AS-SET</p>
                <p className="text-lg font-mono font-semibold text-foreground">
                  {network.irr_as_set || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  IPv4 Prefixes
                </p>
                <p className="text-lg font-mono font-semibold text-foreground">
                  {network.info_prefixes4 || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  IPv6 Prefixes
                </p>
                <p className="text-lg font-mono font-semibold text-foreground">
                  {network.info_prefixes6 || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Network Type
                </p>
                <p className="text-lg font-semibold text-foreground capitalize">
                  {network.info_type || "N/A"}
                </p>
              </div>
              {network.policy_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Full Policy
                  </p>
                  <a
                    href={network.policy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Policy Document
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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
