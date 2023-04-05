import {RegionId} from "../region/region.domain";
import {UserId} from "../user/user.domain";

export type TrackId = string;

export interface TrackSmallWithoutId {
  start_time: string,
  end_time: string,
  line: number,
  run: number,
  region: RegionId,
  owner: UserId,
  finished: boolean,
  correlated: boolean,
  gps: GpsEntry[]
}

export type TrackWithoutId = TrackSmallWithoutId & {
  gps: GpsEntry[]
}

export interface GpsEntry {
  lat: number;
  lon: number;
  time: string;
}

export type TrackSmallWithId = { id: TrackId } & TrackSmallWithoutId;
export type TrackWithId = { id: TrackId } & TrackWithoutId;

export interface Correlation {
  id: number;
  lat: number;
  lon: number;
  region: RegionId;
  reporting_point: number;
  run_owner: UserId,
  trekkie_id: TrackId,
}
