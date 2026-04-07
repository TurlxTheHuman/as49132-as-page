import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Globe, MessageSquare, ExternalLink } from "lucide-react";
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

export default async function ContactPage() {
  const data = await getPeeringData();
  const { network } = data;

  const contactMethods = [
    {
      icon: Mail,
      title: "Peering Requests",
      description: "For peering inquiries and requests",
      value: `peering@${network.website?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "as49132.net"}`,
      href: `mailto:peering@${network.website?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "as49132.net"}`,
    },
    {
      icon: Mail,
      title: "NOC Contact",
      description: "24/7 Network Operations Center",
      value: `noc@${network.website?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "as49132.net"}`,
      href: `mailto:noc@${network.website?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "as49132.net"}`,
    },
    {
      icon: Globe,
      title: "Website",
      description: "Visit our main website",
      value: network.website || "N/A",
      href: network.website,
    },
    {
      icon: MessageSquare,
      title: "PeeringDB",
      description: "View our full PeeringDB record",
      value: `peeringdb.com/asn/${network.asn}`,
      href: `https://www.peeringdb.com/asn/${network.asn}`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interested in peering with AS49132? Get in touch with our team.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {contactMethods.map((method) => (
            <Card
              key={method.title}
              className="bg-card border-border hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <method.icon className="h-5 w-5 text-primary" />
                  </div>
                  {method.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  {method.description}
                </p>
                {method.href ? (
                  <a
                    href={method.href}
                    target={method.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={method.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    {method.value}
                    {!method.href.startsWith("mailto:") && (
                      <ExternalLink className="h-4 w-4" />
                    )}
                  </a>
                ) : (
                  <span className="text-foreground font-medium">
                    {method.value}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Info */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">AS Number</p>
                <p className="text-xl font-mono font-bold text-foreground">
                  AS{network.asn}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Network Name</p>
                <p className="text-xl font-semibold text-foreground">
                  {network.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">AS-SET</p>
                <p className="text-xl font-mono font-semibold text-foreground">
                  {network.irr_as_set || "N/A"}
                </p>
              </div>
            </div>

            {network.notes && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Notes</p>
                <p className="text-foreground whitespace-pre-wrap">
                  {network.notes}
                </p>
              </div>
            )}
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
