import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import BaseLayer from "ol/layer/Base";
import Icon from "ol/style/Icon";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {

  @Input()
  public lat = 0;
  @Input()
  public lon = 0;
  @Input()
  public zoom = 0;
  @Input()
  public marker = false;

  private map?: Map;
  @ViewChild('map')
  private mapEle?: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const layers: BaseLayer[] = [this.createOsmLightDarkLayer()];

    if (this.marker) {
      layers.push(this.createSingleMarkerLayer());
    }

    this.map = new Map({
      view: new View({
        center: [this.lon, this.lat],
        zoom: this.zoom
      }),
      layers,
      target: this.mapEle?.nativeElement,
    });
  }

  private createOsmLightDarkLayer() {
    const tileLayer = new TileLayer({source: new OSM()});

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

    return tileLayer;
  }

  private createSingleMarkerLayer() {
    const iconFeature = new Feature({
      geometry: new Point([this.lon, this.lat]),
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

    return new VectorLayer({source: new VectorSource({features: [iconFeature]})})
  }
}
