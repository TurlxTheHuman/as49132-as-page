import { NextResponse } from "next/server";

const ASN = 49132;

interface RipeNeighbour {
  asn: number;
  type: string;
  power: number;
  v4_peers: number;
  v6_peers: number;
}

interface RipePrefix {
  prefix: string;
  timelines: Array<{
    starttime: string;
    endtime: string;
  }>;
}

export async function GET() {
  try {
    // Fetch all RIPE data in parallel
    const [
      neighboursResponse,
      prefixesResponse,
      overviewResponse,
      routingResponse,
      rirResponse,
      asnHistoryResponse,
    ] = await Promise.all([
      fetch(
        `https://stat.ripe.net/data/asn-neighbours/data.json?resource=AS${ASN}`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://stat.ripe.net/data/announced-prefixes/data.json?resource=AS${ASN}`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://stat.ripe.net/data/as-overview/data.json?resource=AS${ASN}`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://stat.ripe.net/data/routing-status/data.json?resource=AS${ASN}`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://stat.ripe.net/data/rir/data.json?resource=AS${ASN}`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://stat.ripe.net/data/routing-history/data.json?resource=AS${ASN}&min_peers=10`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    const [
      neighboursData,
      prefixesData,
      overviewData,
      routingData,
      rirData,
      asnHistoryData,
    ] = await Promise.all([
      neighboursResponse.json(),
      prefixesResponse.json(),
      overviewResponse.json(),
      routingResponse.json(),
      rirResponse.json(),
      asnHistoryResponse.json(),
    ]);

    // Process neighbours
    const neighbours: RipeNeighbour[] = neighboursData.data?.neighbours || [];
    const upstreamPeers = neighbours.filter((n) => n.type === "left");
    const downstreamPeers = neighbours.filter((n) => n.type === "right");
    const uncertainPeers = neighbours.filter((n) => n.type === "uncertain");

    // Sort peers by power (visibility)
    const sortedPeers = [...neighbours].sort((a, b) => b.power - a.power);

    // Process prefixes
    const prefixes: RipePrefix[] = prefixesData.data?.prefixes || [];
    const ipv4Prefixes = prefixes.filter((p) => !p.prefix.includes(":"));
    const ipv6Prefixes = prefixes.filter((p) => p.prefix.includes(":"));

    // Get routing status info
    const routingStatus = routingData.data || {};

    // Get RIR info
    const rirInfo = rirData.data?.rirs?.[0] || {};

    // Get routing history for timeline
    const routingHistory = asnHistoryData.data?.by_origin || [];

    return NextResponse.json({
      asn: ASN,
      holder: overviewData.data?.holder || null,
      announced: overviewData.data?.announced || false,
      peers: {
        total: neighbours.length,
        upstream: upstreamPeers.length,
        downstream: downstreamPeers.length,
        uncertain: uncertainPeers.length,
        list: sortedPeers.map((n) => ({
          asn: n.asn,
          type: n.type,
          power: n.power,
          v4_peers: n.v4_peers,
          v6_peers: n.v6_peers,
        })),
        upstreamList: upstreamPeers.sort((a, b) => b.power - a.power).map((n) => ({
          asn: n.asn,
          type: n.type,
          power: n.power,
          v4_peers: n.v4_peers,
          v6_peers: n.v6_peers,
        })),
        downstreamList: downstreamPeers.sort((a, b) => b.power - a.power).map((n) => ({
          asn: n.asn,
          type: n.type,
          power: n.power,
          v4_peers: n.v4_peers,
          v6_peers: n.v6_peers,
        })),
      },
      prefixes: {
        total: prefixes.length,
        ipv4: {
          count: ipv4Prefixes.length,
          list: ipv4Prefixes.map((p) => p.prefix),
        },
        ipv6: {
          count: ipv6Prefixes.length,
          list: ipv6Prefixes.map((p) => p.prefix),
        },
      },
      routing: {
        visibility: routingStatus.visibility?.v4 || 0,
        visibilityV6: routingStatus.visibility?.v6 || 0,
        firstSeen: routingStatus.first_seen?.time || null,
        observedNeighbours: routingStatus.observed_neighbours || 0,
      },
      rir: {
        name: rirInfo.rir || null,
        country: rirInfo.country || null,
        registration: rirInfo.registration || null,
      },
      history: routingHistory.slice(0, 30).map((entry: { origin: number; prefixes: Array<{ prefix: string; timelines: Array<{ starttime: string; endtime: string }> }> }) => ({
        origin: entry.origin,
        prefixes: entry.prefixes?.length || 0,
      })),
      queryTime: neighboursData.query_time || new Date().toISOString(),
    });
  } catch (error) {
    console.error("RIPE API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from RIPE" },
      { status: 500 }
    );
  }
}
