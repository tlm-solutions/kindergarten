import {Injectable} from '@angular/core';
import {webSocket} from "rxjs/webSocket";
import {HttpClient} from "@angular/common/http";
import {LIZARD_BASE_PATH, SOCKET_BASE_PATH} from "../api.domain";
import {BehaviorSubject, catchError, map, Observable, retry, tap, throwError} from "rxjs";
import {Data, Source} from "./network.domain";

export interface WsData {
  id: string,
  source: number,
  time: string,
  region: string,
  lat: number,
  lon: number,
  line: number,
  run: number,
  delayed: number|undefined,
  r09_reporting_point: number|undefined;
  r09_destination_number: number|undefined;
}

export interface LizardData {
  id: number,
  source: string,
  time: number,
  region: number,
  lat: number,
  lon: number,
  line: number,
  run: number,
  delayed: number | null,
  r09_reporting_point: number | null;
  r09_destination_number: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private readonly vehicles = new BehaviorSubject<Data[]>([]);

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  public getVehicle(line: number, run: number): Observable<Data | undefined> {
    return this.vehicles.pipe(map(vehicles => vehicles.find(vehicle => vehicle.line === line && vehicle.run === run)));
  }

  public sync(regionId: number): Observable<Data[]> {
    console.log(`Syncing ${regionId}`)
    return this.http.get<LizardData[]>(`${LIZARD_BASE_PATH}/vehicles/${regionId}`)
      .pipe(
        map(data => data.map<Data>(data => ({
          id: data.id,
          source: getSource(data.source),
          time: data.time,
          region: data.region,
          lat: data.lat,
          lon: data.lon,
          line: data.line,
          run: data.run,
          delayed: data.delayed,
          r09_reporting_point: data.r09_reporting_point,
          r09_destination_number: data.r09_destination_number,
        }))),
        tap(data => this.receive(...data))
      );
  }

  public sub(): Observable<Data> {
    return webSocket<WsData>(SOCKET_BASE_PATH)
      .pipe(
        catchError(err => {
          console.error("Websocket Error:", err);
          return throwError(() => err);
        }),
        retry({delay: 1000}),
        map<WsData, Data>(data => ({
          id: Number(data.id),
          source: data.source,
          time: Number(data.time),
          region: Number(data.region),
          lat: data.lat,
          lon: data.lon,
          line: data.line,
          run: data.run,
          delayed: data.delayed ?? null,
          r09_reporting_point: data.r09_reporting_point ?? null,
          r09_destination_number: data.r09_destination_number ?? null,
        })),
        tap(data => this.receive(data))
      );
  }

  private receive(...data: Data[]): void {
    const vehicles = [...this.vehicles.value];

    data.forEach(data => {
      const idx = vehicles.findIndex(vehicle => vehicle.line === data.line && vehicle.run === data.run);

      if (idx >= 0) {
        vehicles[idx] = data;
      } else {
        vehicles.push(data);
      }
    });

    this.vehicles.next(vehicles);
  }
}

function getSource(name: string): number {
  switch (name) {
    case "UnknownSource":
      return Source.UnknownSource;
    case "R09Telegram":
      return Source.R09Telegram;
    case "TrekkieGPS":
      return Source.TrekkieGPS;
    default:
      console.error(`Unknown source type: ${name}`);
      return 999;
  }
}
