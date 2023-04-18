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

export interface ReportingPoint {
  id: number;
  region: RegionId;
  reporting_point: number;
  lat: number;
  lon: number;
  ground_truth: boolean;
}

export enum Encoding {
  Other = 0,
  OnOffKeying = 1,
  Nemo = 2,
}

export enum Type {
  BUS = "bus",
  TRAM = "tram",
}

export interface Line {
  name: string;
  type: Type;
  description: string | undefined;
}
