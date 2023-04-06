import {IdHolder} from "../api.domain";

export type RegionId = number;

export interface Region extends IdHolder<RegionId> {
  name: string;
  transport_company: string;
  regional_company: string | null;
  frequency: string | null;
  r09_type: number | null,
  encoding: Encoding | null,
  lat: number;
  lon: number;
  zoom: number;
  work_in_progress: boolean;
  deactivated: boolean,
}

export enum Encoding {
  Other = 0,
  OnOffKeying = 1,
  Nemo = 2,
}
