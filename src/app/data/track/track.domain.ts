import {RegionId} from "../region/region.domain";
import {UserId} from "../user/user.domain";

export type TrackId = string;

export interface TrackWithoutId {
  start_time: string,
  end_time: string,
  line: number,
  run: number,
  gps_file: number,
  region: RegionId,
  owner: UserId,
  finished: boolean,
}

export type TrackWithId = { id: TrackId } & TrackWithoutId;
