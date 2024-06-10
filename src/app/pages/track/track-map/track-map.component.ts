import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Style from "ol/style/Style";
import BaseLayer from "ol/layer/Base";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import LineString from "ol/geom/LineString";
pnpimport { Coordinate } from "ol/coordinate";
import Stroke from "ol/style/Stroke";
import WebGLTileLayer from "ol/layer/WebGLTile";
import Point from "ol/geom/Point";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import { CommonModule } from "@angular/common";

// const MARKER_STYLE = new Style({
//   image: new Icon({
//     anchor: [0.5, 46],
//     anchorXUnits: 'fraction',
//     anchorYUnits: 'pixels',
//     src: 'assets/icons/marker.svg',
//   }),
// });

const LINE_STYLE = new Style({
  stroke: new Stroke({
    color: '#ba82e3',
    width: 5
  })
});

const HIGHLIGHTED_LINE_STYLE = new Style({
  stroke: new Stroke({
    color: '#DAA520',
    width: 5
  })
});

const MARKER_STYLE = new Style({
  image: new Circle({
    radius: 6,
    fill: new Fill({ color: 'rgba(24,166,19,0.9)' }),
    stroke: new Stroke({ color: '#1cff3b' })
  }),
});

@Component({
  selector: 'app-track-map',
  templateUrl: './track-map.component.html',
  styleUrls: ['./track-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class TrackMapComponent implements OnChanges, AfterViewInit {

  @Input()
  public lines: Coordinate[][] = [];
  @Input()
  public highlightedLines: Coordinate[][] = [];
  @Input()
  public markers: Coordinate[] = [];

  private view?: View;
  private features = new VectorSource<Feature<Point>>();
  private lineFeatures = new VectorSource<Feature<LineString>>();

  private map?: Map;

  constructor(
    private readonly hostElement: ElementRef<HTMLElement>,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    let update = false;

    if (changes["lines"]) {
      const lines = changes["lines"].currentValue;

      let feature;
      while ((feature = this.lineFeatures.getFeaturesCollection()?.getArray().find(feature => String(feature.getId()).startsWith('line'))) !== undefined) {
        this.lineFeatures.removeFeature(feature);
      }

      this.lineFeatures.addFeatures(this.createLines("line", lines, LINE_STYLE));
      update = true;
    }

    if (changes["highlightedLines"]) {
      const highlightedLines = changes["highlightedLines"].currentValue;

      let feature;
      while ((feature = this.lineFeatures.getFeaturesCollection()?.getArray().find(feature => String(feature.getId()).startsWith('highlightedLine'))) !== undefined) {
        this.lineFeatures.removeFeature(feature);
      }

      this.lineFeatures.addFeatures(this.createLines("highlightedLine", highlightedLines, HIGHLIGHTED_LINE_STYLE));
      update = true;
    }

    if (changes["markers"]) {
      const markers: Coordinate[] = changes["markers"].currentValue;

      this.features.addFeatures(markers.map(marker => {
        const feature = new Feature({ geometry: new Point(marker) });
        feature.setStyle(MARKER_STYLE);
        return feature;
      }));

      this.map?.getView().fit(this.features.getExtent(), { maxZoom: 20 });
    }

    if (update) {
      setTimeout(() => {
        const extent = this.features.getExtent();
        if (extent.length !== 0) {
          this.map?.getView().fit(extent, { padding: [20, 20, 20, 20], maxZoom: 20 })
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const layers: BaseLayer[] = [new WebGLTileLayer({ source: new OSM() })];

    layers.push(
      new VectorLayer({ source: this.lineFeatures }),
      new VectorLayer({ source: this.features }),
    );

    this.map = new Map({
      view: this.view = new View({
        center: [0, 0],
        zoom: 0
      }),
      layers,
      target: this.hostElement.nativeElement,
    });
  }

  private createLines(name: string, lines: Coordinate[][], style: Style): Feature<LineString>[] {
    return lines.map((line, idx) => {
      const feature = new Feature({ id: `${name}-${idx}`, geometry: new LineString(line) });
      feature.setStyle(style);

      return feature;
    });
  }
}
