import {RegionId} from "../region/region.domain";
import {UserId} from "../user/user.domain";
import {IdHolder} from "../api.domain";

export type TrackId = string;

export interface Track extends IdHolder<TrackId> {
  start_time: string,
  end_time: string,
  line: number,
  run: number,
  region: RegionId,
  owner: UserId,
  app_name: string,
  app_commit: string,
  finished: boolean,
  correlated: boolean,
  gps: GpsEntry[]
}

export interface GpsEntry {
  lat: number;
  lon: number;
  time: string;
}

export interface Correlation {
  id: number;
  lat: number;
  lon: number;
  reporting_point: number;
}
