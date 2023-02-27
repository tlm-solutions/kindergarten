import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {map, Map, marker, tileLayer} from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map?: Map;

  @ViewChild('map')
  private mapEle?: ElementRef<HTMLDivElement>;

  @Input()
  public lat?: number;
  @Input()
  public lon?: number;

  private initMap(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.map = map(this.mapEle!.nativeElement!, {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      center: [this.lat!, this.lon!],
      zoom: 12
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      className: 'map-tiles',
    }).addTo(this.map);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    marker([this.lat!, this.lon!]).addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
