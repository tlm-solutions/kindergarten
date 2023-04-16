import {Injectable} from '@angular/core';
import {webSocket} from "rxjs/webSocket";
import {HttpClient} from "@angular/common/http";
import {LIZARD_BASE_PATH} from "../api.domain";
import {BehaviorSubject, map, Observable, tap} from "rxjs";

export interface Data {
  id: number | string, // socket outputs string
  source: number | string, // lizard outputs string
  time: number | string, // socket outputs string
  region: number | string, // socket outputs string
  lat: number,
  lon: number,
  line: number,
  run: number,
  delayed: number,
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
    return this.http.get<Data[]>(`${LIZARD_BASE_PATH}/vehicles/${regionId}`)
      .pipe(tap(data => {
        const vehicles = this.vehicles.value;
        vehicles.push(...data);
        this.vehicles.next(vehicles);
      }));
  }

  public sub() {
    return webSocket<Data>("wss://socket.staging.dvb.solutions")
      .pipe(tap(data => {
        const vehicles = this.vehicles.value;
        vehicles.push(data);
        this.vehicles.next(vehicles);
      }));
  }
}
