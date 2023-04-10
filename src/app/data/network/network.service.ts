import {Injectable} from '@angular/core';
import {webSocket} from "rxjs/webSocket";

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
  public sub() {
    return webSocket<Data>("wss://socket.staging.dvb.solutions");
  }
}
