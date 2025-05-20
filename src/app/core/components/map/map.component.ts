import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import BaseLayer from "ol/layer/Base";
import Icon from "ol/style/Icon";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import LineString from "ol/geom/LineString";
import { Coordinate } from "ol/coordinate";
import Stroke from "ol/style/Stroke";
import TileLayer from "ol/layer/Tile";

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
    color: '#DAA520',
    width: 5
  })
});

@Component({
    selector: 'app-map',
    imports: [CommonModule],
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
  @Input()
  public putLinesInCenter = false;

  private view?: View;
  private lineFeatures = new VectorSource<Feature<LineString>>();
  private features = new VectorSource<Feature<Point>>();

  private map?: Map;

  constructor(
    private readonly hostElement: ElementRef<HTMLElement>,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    let update = false;

    if (changes["lat"]) {
      const lat = changes["lat"].currentValue;
      this.view?.setCenter([this.lon, lat]);

      const markerFeature = this.features.getFeatureById("marker");
      if (markerFeature && !(markerFeature instanceof Feature)) {
        throw new Error("new openlayers features are not implemented in kindergarten");
      }

      markerFeature?.setGeometry(new Point([this.lon, lat]));
    }

    if (changes["lon"]) {
      const lon = changes["lon"].currentValue;
      this.view?.setCenter([lon, this.lat]);

      const markerFeature = this.features.getFeatureById("marker");
      if (markerFeature && !(markerFeature instanceof Feature)) {
        throw new Error("new openlayers features are not implemented in kindergarten");
      }

      markerFeature?.setGeometry(new Point([lon, this.lat]));
    }

    if (changes["zoom"]) {
      const zoom = changes["zoom"].currentValue;
      this.view?.setZoom(zoom);
    }

    if (changes["marker"]) {
      const marker = changes["marker"];

      if (marker.previousValue && !marker.currentValue) {
        const feature = this.features.getFeatureById("marker");
        if (feature && !(feature instanceof Feature)) {
          throw new Error("new openlayers features are not implemented in kindergarten");
        }

        if (feature) {
          this.features.removeFeature(feature);
        }
      } else if (!marker.previousValue && marker.currentValue) {
        this.features.addFeature(this.createSingleMarkerLayer());
        update = true;
      }
    }

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

    if (update && this.putLinesInCenter) {
      setTimeout(() => {
        const extent = this.lineFeatures.getExtent();
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
    const layers: BaseLayer[] = [new TileLayer({ source: new OSM() })];

    layers.push(
      new VectorLayer({ source: this.lineFeatures }),
      new VectorLayer({ source: this.features }),
    );

    this.map = new Map({
      view: this.view = new View({
        center: [this.lon, this.lat],
        zoom: this.zoom
      }),
      layers,
      target: this.hostElement.nativeElement,
    });
  }

  private createSingleMarkerLayer(): Feature<Point> {
    const iconFeature = new Feature({
      id: 'marker',
      geometry: new Point([this.lon, this.lat]),
    });

    iconFeature.setStyle(MARKER_STYLE);

    return iconFeature;
  }

  private createLines(name: string, lines: Coordinate[][], style: Style): Feature<LineString>[] {
    return lines.map((line, idx) => {
      const feature = new Feature({ id: `${name}-${idx}`, geometry: new LineString(line) });
      feature.setStyle(style);

      return feature;
    });
  }
}
