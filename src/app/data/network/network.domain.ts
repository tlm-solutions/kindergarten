import { Coordinate } from "ol/coordinate";

export enum Source {
  UnknownSource = 0,
  R09Telegram = 1,
  TrekkieGPS = 2,
}

export interface Data {
  id: number,
  source: Source,
  time: number,
  region: number,
  coordinate: Coordinate,
  line: number,
  run: number,
  delayed: number | null,
  r09_reporting_point: number | null;
  r09_destination_number: number | null;
  history: Coordinate[],
}
