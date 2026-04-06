import { NextResponse } from "next/server";

const ASN = 49132;

export async function GET() {
  try {
    // Fetch network info
    const netResponse = await fetch(
      `https://www.peeringdb.com/api/net?asn=${ASN}`,
      { next: { revalidate: 3600 } }
    );
    const netData = await netResponse.json();

    if (!netData.data || netData.data.length === 0) {
      return NextResponse.json({ error: "Network not found" }, { status: 404 });
    }

    const network = netData.data[0];
    const netId = network.id;

    // Fetch IX (Internet Exchange) connections
    const ixResponse = await fetch(
      `https://www.peeringdb.com/api/netixlan?net_id=${netId}`,
      { next: { revalidate: 3600 } }
    );
    const ixData = await ixResponse.json();

    // Fetch facility connections
    const facResponse = await fetch(
      `https://www.peeringdb.com/api/netfac?net_id=${netId}`,
      { next: { revalidate: 3600 } }
    );
    const facData = await facResponse.json();

    // Fetch IX details for names
    const ixIds = [...new Set(ixData.data?.map((ix: { ix_id: number }) => ix.ix_id) || [])];
    const ixDetails = await Promise.all(
      ixIds.map(async (ixId) => {
        const res = await fetch(`https://www.peeringdb.com/api/ix/${ixId}`, {
          next: { revalidate: 3600 },
        });
        const data = await res.json();
        return data.data?.[0];
      })
    );

    // Fetch facility details for names
    const facIds = [...new Set(facData.data?.map((f: { fac_id: number }) => f.fac_id) || [])];
    const facDetails = await Promise.all(
      facIds.map(async (facId) => {
        const res = await fetch(`https://www.peeringdb.com/api/fac/${facId}`, {
          next: { revalidate: 3600 },
        });
        const data = await res.json();
        return data.data?.[0];
      })
    );

    // Build IX map
    const ixMap = new Map(ixDetails.filter(Boolean).map((ix) => [ix.id, ix]));
    const facMap = new Map(facDetails.filter(Boolean).map((f) => [f.id, f]));

    // Enrich IX data
    const internetExchanges = (ixData.data || []).map(
      (ix: { ix_id: number; ipaddr4: string; ipaddr6: string; speed: number }) => ({
        ...ix,
        ixName: ixMap.get(ix.ix_id)?.name || `IX ${ix.ix_id}`,
        ixCountry: ixMap.get(ix.ix_id)?.country || "Unknown",
        ixCity: ixMap.get(ix.ix_id)?.city || "Unknown",
      })
    );

    // Enrich facility data
    const facilities = (facData.data || []).map(
      (f: { fac_id: number }) => ({
        ...f,
        facName: facMap.get(f.fac_id)?.name || `Facility ${f.fac_id}`,
        facCity: facMap.get(f.fac_id)?.city || "Unknown",
        facCountry: facMap.get(f.fac_id)?.country || "Unknown",
        facAddress: facMap.get(f.fac_id)?.address1 || "",
      })
    );

    return NextResponse.json({
      network: {
        name: network.name,
        asn: network.asn,
        website: network.website,
        irr_as_set: network.irr_as_set,
        info_prefixes4: network.info_prefixes4,
        info_prefixes6: network.info_prefixes6,
        info_traffic: network.info_traffic,
        info_ratio: network.info_ratio,
        info_scope: network.info_scope,
        info_type: network.info_type,
        policy_general: network.policy_general,
        policy_url: network.policy_url,
        notes: network.notes,
      },
      internetExchanges,
      facilities,
    });
  } catch (error) {
    console.error("PeeringDB API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from PeeringDB" },
      { status: 500 }
    );
  }
}
