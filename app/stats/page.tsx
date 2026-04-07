"use client";

import useSWR from "swr";
import { SiteHeader } from "@/components/site-header";
import { RipeData, PeeringDBData } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Server,
  Network,
  Eye,
  Calendar,
  Shield,
  ExternalLink,
  TrendingUp,
  Zap,
  Building2,
  MapPin,
} from "lucide-react";
import type { InternetExchange, Facility } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function formatDate(dateString: string | null) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatSpeed(speed: number): string {
  if (speed >= 100000) return `${speed / 1000}G`;
  if (speed >= 1000) return `${speed / 1000}G`;
  return `${speed}M`;
}

function PeerTypeLabel({ type }: { type: string }) {
  const config = {
    left: { label: "Upstream", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    right: { label: "Downstream", className: "bg-green-500/20 text-green-400 border-green-500/30" },
    uncertain: { label: "Peer", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  };
  const { label, className } = config[type as keyof typeof config] || config.uncertain;
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${className}`}>
      {label}
    </span>
  );
}

export default function StatsPage() {
  const { data: ripeData, error: ripeError, isLoading: ripeLoading } = useSWR<RipeData>(
    "/api/ripe",
    fetcher
  );
  const { data: pdbData, isLoading: pdbLoading } = useSWR<PeeringDBData>(
    "/api/peeringdb",
    fetcher
  );

  if (ripeLoading || pdbLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-muted-foreground">Loading statistics from RIPEstat...</p>
          </div>
        </div>
      </div>
    );
  }

  if (ripeError || !ripeData) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-destructive">Failed to load statistics</p>
        </div>
      </div>
    );
  }

  const visibilityPercent = Math.round(ripeData.routing.visibility * 100);
  const visibilityV6Percent = Math.round(ripeData.routing.visibilityV6 * 100);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="py-16 border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-primary font-medium mb-2">Network Statistics</p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                AS{ripeData.asn}
              </h1>
              {ripeData.holder && (
                <p className="text-xl text-muted-foreground mt-2">{ripeData.holder}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${ripeData.announced
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
              >
                {ripeData.announced ? "Announced" : "Not Announced"}
              </span>
              <a
                href={`https://stat.ripe.net/AS${ripeData.asn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
              >
                RIPEstat
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Stats */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Network className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{ripeData.peers.total}</p>
                <p className="text-sm text-muted-foreground">Total Peers</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <ArrowUpRight className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{ripeData.peers.upstream}</p>
                <p className="text-sm text-muted-foreground">Upstream Providers</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <ArrowDownRight className="h-5 w-5 text-green-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{ripeData.peers.downstream}</p>
                <p className="text-sm text-muted-foreground">Downstream Networks</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{ripeData.peers.uncertain}</p>
                <p className="text-sm text-muted-foreground">Peering Sessions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Routing & Visibility */}
      <section className="py-12 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Routing Status</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-primary" />
                  Global Visibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">IPv4 Visibility</span>
                    <span className="text-sm font-medium text-foreground">{visibilityPercent}%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${visibilityPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">IPv6 Visibility</span>
                    <span className="text-sm font-medium text-foreground">{visibilityV6Percent}%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${visibilityV6Percent}%` }}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Observed Neighbours</span>
                    <span className="text-lg font-semibold text-foreground">
                      {ripeData.routing.observedNeighbours}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  Registration Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">RIR</span>
                  <span className="font-medium text-foreground">
                    {ripeData.rir?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Country</span>
                  <span className="font-medium text-foreground">
                    {ripeData.rir?.country || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">First Seen</span>
                  <span className="font-medium text-foreground">
                    {formatDate(ripeData.routing.firstSeen)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="font-medium text-foreground">
                    {formatDate(ripeData.queryTime)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Prefixes */}
      <section className="py-12 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Announced Prefixes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* IPv4 Prefixes */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5 text-primary" />
                    IPv4 Prefixes
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {ripeData.prefixes.ipv4.count}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ripeData.prefixes.ipv4.list.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {ripeData.prefixes.ipv4.list.map((prefix, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 px-3 bg-secondary/50 rounded-lg"
                      >
                        <code className="text-sm font-mono text-foreground">{prefix}</code>
                        <a
                          href={`https://stat.ripe.net/${prefix}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No IPv4 prefixes announced</p>
                )}
              </CardContent>
            </Card>

            {/* IPv6 Prefixes */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg">
                    <Server className="h-5 w-5 text-blue-400" />
                    IPv6 Prefixes
                  </div>
                  <span className="text-2xl font-bold text-blue-400">
                    {ripeData.prefixes.ipv6.count}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ripeData.prefixes.ipv6.list.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {ripeData.prefixes.ipv6.list.map((prefix, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 px-3 bg-secondary/50 rounded-lg"
                      >
                        <code className="text-sm font-mono text-foreground break-all">{prefix}</code>
                        <a
                          href={`https://stat.ripe.net/${prefix}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors ml-2 flex-shrink-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No IPv6 prefixes announced</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Peers List */}
      <section className="py-12 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">BGP Neighbours</h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upstream Providers */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg">
                    <ArrowUpRight className="h-5 w-5 text-blue-400" />
                    Upstream Providers
                  </div>
                  <span className="text-lg font-semibold text-blue-400">
                    {ripeData.peers.upstream}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ripeData.peers.upstreamList && ripeData.peers.upstreamList.length > 0 ? (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {ripeData.peers.upstreamList.map((peer, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-3 px-4 bg-secondary/50 rounded-lg hover:bg-secondary/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <a
                            href={`https://www.peeringdb.com/asn/${peer.asn}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono font-medium text-foreground hover:text-primary transition-colors"
                          >
                            AS{peer.asn}
                          </a>
                          <PeerTypeLabel type={peer.type} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span title="IPv4 peers">v4: {peer.v4_peers}</span>
                          <span title="IPv6 peers">v6: {peer.v6_peers}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No upstream providers detected</p>
                )}
              </CardContent>
            </Card>

            {/* Downstream Networks */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg">
                    <ArrowDownRight className="h-5 w-5 text-green-400" />
                    Downstream Networks
                  </div>
                  <span className="text-lg font-semibold text-green-400">
                    {ripeData.peers.downstream}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ripeData.peers.downstreamList && ripeData.peers.downstreamList.length > 0 ? (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {ripeData.peers.downstreamList.map((peer, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-3 px-4 bg-secondary/50 rounded-lg hover:bg-secondary/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <a
                            href={`https://stat.ripe.net/AS${peer.asn}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono font-medium text-foreground hover:text-primary transition-colors"
                          >
                            AS{peer.asn}
                          </a>
                          <PeerTypeLabel type={peer.type} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span title="IPv4 peers">v4: {peer.v4_peers}</span>
                          <span title="IPv6 peers">v6: {peer.v6_peers}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No downstream networks detected</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* All Peers Table */}
          <Card className="bg-card border-border mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  All BGP Neighbours (by visibility)
                </div>
                <span className="text-lg font-semibold text-primary">
                  {ripeData.peers.total}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ASN</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Power</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">IPv4 Peers</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">IPv6 Peers</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Links</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ripeData.peers.list.slice(0, 50).map((peer, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-medium text-foreground">AS{peer.asn}</span>
                        </td>
                        <td className="py-3 px-4">
                          <PeerTypeLabel type={peer.type} />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${Math.min(peer.power * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {(peer.power * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{peer.v4_peers}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{peer.v6_peers}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`https://stat.ripe.net/AS${peer.asn}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="View on RIPEstat"
                            >
                              <Activity className="h-4 w-4" />
                            </a>
                            <a
                              href={`https://www.peeringdb.com/asn/${peer.asn}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="View on PeeringDB"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {ripeData.peers.list.length > 50 && (
                <p className="text-center text-sm text-muted-foreground mt-4 py-2 border-t border-border">
                  Showing top 50 of {ripeData.peers.list.length} peers by visibility
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Locations Section - Internet Exchanges & Facilities */}
      {pdbData && (
        <section className="py-12 border-t border-border">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Locations & Presence</h2>
            
            {/* Location Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <Network className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">
                    {pdbData.internetExchanges.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Internet Exchanges</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">
                    {pdbData.facilities.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Facilities</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">
                    {[...new Set([
                      ...pdbData.internetExchanges.map((ix: InternetExchange) => ix.ixCountry),
                      ...pdbData.facilities.map((f: Facility) => f.facCountry)
                    ])].length}
                  </p>
                  <p className="text-sm text-muted-foreground">Countries</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">
                    {[...new Set(pdbData.internetExchanges.map((ix: InternetExchange) => ix.ixCity))].length}
                  </p>
                  <p className="text-sm text-muted-foreground">Cities</p>
                </CardContent>
              </Card>
            </div>

            {/* Internet Exchanges Table */}
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg">
                    <Network className="h-5 w-5 text-primary" />
                    Internet Exchanges
                  </div>
                  <span className="text-lg font-semibold text-primary">
                    {pdbData.internetExchanges.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Exchange</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Speed</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">IPv4</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">IPv6</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pdbData.internetExchanges.map((ix: InternetExchange, index: number) => (
                        <tr
                          key={`${ix.ix_id}-${index}`}
                          className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <span className="font-medium text-foreground">{ix.ixName}</span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {ix.ixCity}, {ix.ixCountry}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded">
                              {formatSpeed(ix.speed)}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-sm text-muted-foreground">
                            {ix.ipaddr4 || "-"}
                          </td>
                          <td className="py-3 px-4 font-mono text-sm text-muted-foreground">
                            {ix.ipaddr6 || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Facilities Grid */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                    Facilities
                  </div>
                  <span className="text-lg font-semibold text-primary">
                    {pdbData.facilities.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pdbData.facilities.map((fac: Facility, index: number) => (
                    <div
                      key={`${fac.fac_id}-${index}`}
                      className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      <h3 className="font-semibold text-foreground mb-2">{fac.facName}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{fac.facCity}, {fac.facCountry}</span>
                      </div>
                      {fac.facAddress && (
                        <p className="mt-2 text-sm text-muted-foreground">{fac.facAddress}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Data sourced from{" "}
            <a
              href={`https://stat.ripe.net/AS${ripeData.asn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              RIPEstat
            </a>
            {pdbData && (
              <>
                {" & "}
                <a
                  href={`https://www.peeringdb.com/asn/${pdbData.network.asn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  PeeringDB
                </a>
              </>
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}
