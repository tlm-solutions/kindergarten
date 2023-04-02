import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import {Feature} from "ol";
import {Point} from "ol/geom";
import {Icon, Style} from "ol/style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

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
  @Input()
  public zoom?: number;

  private initMap(): void {
    const tileLayer = new TileLayer({source: new OSM()});

    const iconFeature = new Feature({
      geometry: new Point([this.lon ?? 0, this.lat ?? 0]),
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'assets/icons/marker.svg',
      }),
    });

    iconFeature.setStyle(iconStyle);

    this.map = new Map({
      view: new View({
        center: [this.lon ?? 0, this.lat ?? 0],
        zoom: this.zoom ?? 12
      }),
      layers: [
        tileLayer,
        new VectorLayer({source: new VectorSource({features: [iconFeature]})})
      ],
      target: this.mapEle?.nativeElement,
    });

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      tileLayer.on('prerender', event => {
        if (event.context) {
          const context = event.context as CanvasRenderingContext2D;
          context.filter = 'brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)';
          context.globalCompositeOperation = 'source-over';
        }
      });

      tileLayer.on('postrender', event => {
        if (event.context) {
          const context = event.context as CanvasRenderingContext2D;
          context.filter = 'none';
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
