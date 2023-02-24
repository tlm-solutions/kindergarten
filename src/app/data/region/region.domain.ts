export type RegionId = number;

export interface RegionWithoutId {
  name: string;
  transport_company: string;
  regional_company: string;
  frequency: string;
  r09_type: number,
  encoding: Encoding,
  deactivated: boolean,
}

export type RegionWithId = { id: RegionId } & RegionWithoutId;

export enum Encoding {
  Other = 0,
  OnOffKeying = 1,
  Nemo = 2,
}
