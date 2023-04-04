import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import BaseLayer from "ol/layer/Base";
import Icon from "ol/style/Icon";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import LineString from "ol/geom/LineString";
import {Coordinate} from "ol/coordinate";
import Stroke from "ol/style/Stroke";

const MARKER_STYLE = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'assets/icons/marker.svg',
  }),
});

const LINE_STYLE = new Style({
  stroke: new Stroke({
    color: '#ba82e3',
    width: 5
  })
});

const SElECTED_LINE_STYLE = new Style({
  stroke: new Stroke({
    color: '#9e32ef',
    width: 5
  })
});

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
  @Input()
  public lines: Coordinate[][] = [];
  @Input()
  public highlightedLines: Coordinate[][] = [];

  private map?: Map;
  @ViewChild('map')
  private mapEle?: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const layers: BaseLayer[] = [this.createOsmLightDarkLayer()];

    const features: Feature[] = [];

    if (this.marker) features.push(this.createSingleMarkerLayer());

    this.lines.forEach(line => {
      const feature = new Feature(new LineString(line));
      feature.setStyle(LINE_STYLE);

      features.push(feature);
    });

    this.highlightedLines.forEach(line => {
      const feature = new Feature(new LineString(line));
      feature.setStyle(SElECTED_LINE_STYLE);

      features.push(feature);
    });

    if (features.length) {
      const layer = new VectorLayer({
        source: new VectorSource({features})
      })

      layers.push(layer);
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

  private createSingleMarkerLayer(): Feature<Point> {
    const iconFeature = new Feature({
      geometry: new Point([this.lon, this.lat]),
    });

    iconFeature.setStyle(MARKER_STYLE);

    return iconFeature;
  }
}
