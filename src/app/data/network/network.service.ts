import {Injectable} from '@angular/core';
import {webSocket} from "rxjs/webSocket";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Vehicle} from "../../pages/map/map-windshield/map-windshield.component";
import Point from "ol/geom/Point";
import {UnknownVehicle} from "../../pages/map/map-windshield/vehicle/unknown";

export interface Data {
  delayed: number,
  id: string,
  lat: number,
  line: number,
  lon: number,
  region: string,
  run: number,
  source: number,
  time: string,
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private readonly network0 = new BehaviorSubject<Map<string, Vehicle<Point>>>(new Map());
  private readonly vehicles = new Subject<Vehicle<Point>>();

  public getNetwork(): Observable<Map<string, Vehicle<Point>>> {
    return this.network0.asObservable();
  }

  public getVehicles(): Observable<Vehicle<Point>> {
    return this.vehicles.asObservable();
  }

  public getVehiclesNow(): IterableIterator<Vehicle<Point>> {
    return this.network0.value.values();
  }

  public sub() {
    webSocket<Data>("wss://socket.staging.dvb.solutions")
      .subscribe(data => {
        const network = new Map(this.network0.value);
        const id = `${data.line}_${data.run}`;
        const vehicle = network.get(id);

        if (vehicle) {
          vehicle.move([data.lon, data.lat], data.delayed, Number(data.time))
        }
        else {
          const vehicle = new UnknownVehicle(id, String(data.line), String(data.run), 'k', [data.lon, data.lat], Number(data.time));
          network.set(id, vehicle);

          this.network0.next(network);
          this.vehicles.next(vehicle)
        }
      })
  }
}
