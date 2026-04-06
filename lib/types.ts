export interface Network {
  name: string;
  asn: number;
  website: string;
  irr_as_set: string;
  info_prefixes4: number;
  info_prefixes6: number;
  info_traffic: string;
  info_ratio: string;
  info_scope: string;
  info_type: string;
  policy_general: string;
  policy_url: string;
  notes: string;
}

export interface InternetExchange {
  id: number;
  ix_id: number;
  ixName: string;
  ixCountry: string;
  ixCity: string;
  ipaddr4: string;
  ipaddr6: string;
  speed: number;
  is_rs_peer: boolean;
}

export interface Facility {
  id: number;
  fac_id: number;
  facName: string;
  facCity: string;
  facCountry: string;
  facAddress: string;
}

export interface PeeringDBData {
  network: Network;
  internetExchanges: InternetExchange[];
  facilities: Facility[];
}
