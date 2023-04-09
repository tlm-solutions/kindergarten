import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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

const HIGHLIGHTED_LINE_STYLE = new Style({
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
export class MapComponent implements OnChanges, AfterViewInit {

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

  private view?: View;
  private features: Feature[] = [];

  private map?: Map;
  @ViewChild('map')
  private mapEle?: ElementRef<HTMLDivElement>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes["lat"]) {
      const lat = changes["lat"].currentValue;
      this.view?.setCenter([this.lon, lat]);

      const markerFeature = this.features.find(feature => feature.get("name") === "marker");
      markerFeature?.setGeometry(new Point([this.lon, lat]));
    }

    if (changes["lon"]) {
      const lon = changes["lon"].currentValue;
      this.view?.setCenter([lon, this.lat]);

      const markerFeature = this.features.find(feature => feature.get("name") === "marker");
      markerFeature?.setGeometry(new Point([lon, this.lat]));
    }

    if (changes["zoom"]) {
      const zoom = changes["zoom"].currentValue;
      this.view?.setZoom(zoom);
    }

    if (changes["marker"]) {
      const marker = changes["marker"];

      if (marker.previousValue && !marker.currentValue) {
        const idx = this.features.findIndex(feature => feature.get('name') === "marker");
        this.features.splice(idx, 1);
      }
      else if (!marker.previousValue && marker.currentValue) {
        this.features.push(this.createSingleMarkerLayer());
      }
    }

    if (changes["lines"]) {
      const lines = changes["lines"].currentValue;

      let idx;
      while ((idx = this.features.findIndex(feature => feature.get('name').startsWith('line'))) !== -1) {
        this.features.splice(idx, 1);
      }

      this.features.push(...this.createLines("line", lines, LINE_STYLE));
    }

    if (changes["highlightedLines"]) {
      const highlightedLines = changes["highlightedLines"].currentValue;

      let idx;
      while ((idx = this.features.findIndex(feature => feature.get('name').startsWith('highlightedLine'))) !== -1) {
        this.features.splice(idx, 1);
      }

      this.features.push(...this.createLines("highlightedLine", highlightedLines, HIGHLIGHTED_LINE_STYLE));
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const layers: BaseLayer[] = [this.createOsmLightDarkLayer()];

    if (this.marker) this.features.push(this.createSingleMarkerLayer());
    this.features.push(...this.createLines("line", this.lines, LINE_STYLE));
    this.features.push(...this.createLines("highlightedLine", this.highlightedLines, HIGHLIGHTED_LINE_STYLE));

    if (this.features.length) {
      const layer = new VectorLayer({
        source: new VectorSource({features: this.features})
      })

      layers.push(layer);
    }

    this.map = new Map({
      view: this.view = new View({
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
      name: 'marker',
      geometry: new Point([this.lon, this.lat]),
    });

    iconFeature.setStyle(MARKER_STYLE);

    return iconFeature;
  }

  private createLines(name: string, lines: Coordinate[][], style: Style): Feature<LineString>[] {
    return lines.map((line, idx) => {
      const feature = new Feature({name: `${name}-${idx}`, geometry: new LineString(line)});
      feature.setStyle(style);

      return feature;
    });
  }
}
